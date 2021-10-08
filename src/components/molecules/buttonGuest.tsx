import React, { useState } from 'react';

import Button from '@components/molecules/button';
import Modal from '@components/organisms/modal';
import clsx from 'clsx';
import Link from 'next/link';
import {
	makeDiscoverRoute,
	makeLoginRoute,
	makeRegisterRoute,
} from '@lib/routes';
import useLanguageRoute from '@lib/useLanguageRoute';

export default function ButtonGuest({
	className,
}: {
	className?: string;
}): JSX.Element {
	const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
	const language = useLanguageRoute();

	return (
		<>
			<a
				className={clsx('decorated', className)}
				onClick={() => setIsGuestModalOpen(true)}
			>
				Continue as guest
			</a>
			<Modal
				open={isGuestModalOpen}
				onClose={() => setIsGuestModalOpen(false)}
				title="Continue as guest?"
				actions={
					<>
						<Link href={makeDiscoverRoute(language)}>
							<a className="decorated">Continue as guest</a>
						</Link>
						<Button
							href={makeLoginRoute(language)}
							type="primary"
							text="Log in"
						/>
						<Button
							href={makeRegisterRoute(language)}
							type="super"
							text="Create account"
						/>
					</>
				}
			>
				<p>
					You&apos;ll be missing out on some key features without an account,
					like:
				</p>
				{/*TODO: Update list contents*/}
				<ul>
					<li>Lorem ipsum dolor</li>
					<li>Et exictur purim multatim</li>
					<li>Dulipscum erudis fesin</li>
				</ul>
			</Modal>
		</>
	);
}
