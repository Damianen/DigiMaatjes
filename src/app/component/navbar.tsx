import { useState } from 'react';
import Image from 'next/image';
import accountIcon from '../../../public/img/accounticon.png';
import logo from '../../../public/img/placeholderlogo.jpg';
import Link from 'next/link';
import { logout } from '../services/auth';

export default function Navbar() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen((prevState) => !prevState);
	};

	const logoutUser = () => {
		logout();
	};

	return (
		<nav className="bg-blue-500 w-full px-4 shadow-md">
			<div className="flex justify-between items-center w-full">
				<Link href="/" className="flex items-center">
					<Image
						src={logo}
						alt="Digimaatjes logo"
						width={100}
						height={50}
					/>
				</Link>

				<div className="relative ml-auto">
					<button
						onClick={toggleDropdown}
						className="flex items-center"
					>
						<Image
							src={accountIcon}
							alt="Account icon"
							width={50}
							height={50}
						/>
					</button>

					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48">
							<ul>
								<li>
									<a
										href="/account"
										className="block px-4 py-2 text-black hover:bg-gray-200 rounded-t-lg"
									>
										Profiel
									</a>
								</li>
								<li>
									<a
										onClick={logoutUser}
										style={{ cursor: 'pointer' }}
										className="block px-4 py-2 text-black hover:bg-gray-200 rounded-b-lg"
									>
										Log uit
									</a>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
