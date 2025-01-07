'use client';
import Image from 'next/image';
import Navbar from '@/app/component/navbar';
import { useState } from 'react';

export default function AccountDetails() {
	const [formData, setFormData] = useState({
		firstName: 'Zaid',
		lastName: 'Karmoudi',
		birthDate: '1998-04-09',
		username: 'Zaidkar',
	});

	const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

	const friends = [
		{ name: 'Coen', isOnline: true },
		{ name: 'Ruben', isOnline: false },
		{ name: 'Damian', isOnline: true },
		{ name: 'Jouke', isOnline: false },
		{ name: 'Extra maat', isOnline: true },
		{ name: 'Extra maat', isOnline: false },
		{ name: 'Extra maat', isOnline: true },
		{ name: 'Extra maat', isOnline: false },
	];

	const [visibleFriendsCount, setVisibleFriendsCount] = useState(4);

	const handleShowMore = () => {
		setVisibleFriendsCount((prevCount) =>
			prevCount === friends.length ? 4 : friends.length
		);
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center px-4 ">
				<main className="w-full max-w-8xl grid grid-cols-1 lg:grid-cols-2 gap-8 px-12 mt-10">
					<div className="bg-white px-8 py-11 rounded-lg shadow-md h-[725px] ">
						<h2 className="text-3xl font-semibold mb-3">
							Mijn gegevens
						</h2>
						<div className="flex flex-col sm:flex-row items-center">
							<div className="w-64 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6">
								{profilePhoto ? (
									<Image
										src={profilePhoto}
										alt="Profiel foto"
										width={128}
										height={128}
										className="object-cover w-full h-full"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
										Profielfoto
									</div>
								)}
							</div>
							<label className="block">
								<span className="sr-only">Foto uploaden</span>
								<button className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
									Upload foto
								</button>
							</label>
						</div>

						<form>
							<div className="mb-6">
								<label className="block text-lg font-medium text-gray-700 mb-1">
									Voornaam
								</label>
								<input
									type="text"
									name="firstName"
									defaultValue={formData.firstName}
									className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
								/>
							</div>
							<div className="mb-6">
								<label className="block text-lg font-medium text-gray-700 mb-1">
									Achternaam
								</label>
								<input
									type="text"
									name="lastName"
									defaultValue={formData.lastName}
									className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
								/>
							</div>
							<div className="mb-6">
								<label className="block text-lg font-medium text-gray-700 mb-1">
									Geboortedatum
								</label>
								<input
									type="date"
									name="birthDate"
									defaultValue={formData.birthDate}
									className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
								/>
							</div>
							<div className="mb-6">
								<label className="block text-lg font-medium text-gray-700 mb-1">
									Gebruikersnaam
								</label>
								<input
									type="text"
									name="username"
									defaultValue={formData.username}
									className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500"
								/>
							</div>
						</form>
					</div>
					<div className="bg-white p-8 rounded-lg shadow-md">
						<h2 className="text-3xl font-semibold mb-5">
							Vrienden
						</h2>
						<div className="space-y-6">
							{friends
								.slice(0, visibleFriendsCount)
								.map((friend, index) => (
									<div
										key={index}
										className="flex items-center justify-between bg-blue-100 p-6 rounded-lg shadow"
									>
										<div className="flex items-center">
											<div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-6"></div>
											<div className="text-xl font-semibold">
												{friend.name}
											</div>
										</div>
										<div
											className={`w-8 h-8 rounded-full ${
												friend.isOnline
													? 'bg-green-500'
													: 'bg-gray-500'
											}`}
										></div>
									</div>
								))}
						</div>

						{friends.length > 4 && (
							<div className="mt-6 text-center">
								<button
									onClick={handleShowMore}
									className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
								>
									{visibleFriendsCount === friends.length
										? 'Toon minder'
										: 'Toon meer'}
								</button>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}
