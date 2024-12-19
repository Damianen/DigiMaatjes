'use client';
import Image from 'next/image';
import accountIcon from '../../../public/img/accounticon.png';
import logo from '../../../public/img/placeholderlogo.jpg';

export default function Navbar() {
	return (
		<nav className="bg-blue-500 min-w-full p-4 shadow-md">
			<div className="flex justify-between items-center w-full">
				<a className="flex items-center">
					<Image
						src={logo}
						alt="Digimaatjes logo"
						width={100}
						height={50}
					/>
				</a>

				<div className="flex items-center">
					<Image
						src={accountIcon}
						alt="Account icon"
						width={75}
						height={50}
					/>
				</div>
			</div>
		</nav>
	);
}
