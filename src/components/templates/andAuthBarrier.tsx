import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Heading2 from '@components/atoms/heading2';
import Button from '@components/molecules/button';
import Modal from '@components/organisms/modal';
import { makeLoginRoute, makeRegisterRoute } from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

import styles from './andAuthBarrier.module.scss';

export type AuthBarrierContextType = {
	challenge: () => void;
};

export const AuthBarrierContext = React.createContext<AuthBarrierContextType>({
	challenge: () => undefined,
});

interface AndAuthBarrierProps {
	children: ReactNode;
}

export default function AndAuthBarrier({
	children,
}: AndAuthBarrierProps): JSX.Element {
	const languageRoute = useLanguageRoute();
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	const authBarrierContext: AuthBarrierContextType = {
		challenge: () => {
			setIsOpen(true);
			throw new Error('Challenging for Authentication');
		},
	};

	return (
		<AuthBarrierContext.Provider value={authBarrierContext}>
			{children}
			<Modal open={isOpen} onClose={handleClose}>
				<Heading2>
					<FormattedMessage
						id="andAuthBarrier__heading"
						defaultMessage="Member Only Feature"
					/>
				</Heading2>
				<p>
					<FormattedMessage
						id="andAuthBarrier__copy"
						defaultMessage="You can bookmark audio to access later on your account. Other features include adding audio to your library."
					/>
				</p>
				<div className={styles.buttonRow}>
					<Button
						type="super"
						href={makeRegisterRoute(languageRoute)}
						onClick={handleClose}
						text={
							<FormattedMessage
								id="andAuthBarrier__createAccount"
								defaultMessage="Create Account"
							/>
						}
					/>
					<Button
						type="primary"
						href={makeLoginRoute(languageRoute)}
						onClick={handleClose}
						text={
							<FormattedMessage
								id="andAuthBarrier__logIn"
								defaultMessage="Log in"
							/>
						}
					/>
					<a
						onClick={handleClose}
						className={clsx(styles.continueAsGuest, 'decorated')}
					>
						<FormattedMessage
							id="andAuthBarrier__continueAsGuest"
							defaultMessage="Continue as guest"
						/>
					</a>
				</div>
			</Modal>
		</AuthBarrierContext.Provider>
	);
}
