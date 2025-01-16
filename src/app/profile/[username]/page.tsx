'use client';
import Image from 'next/image';
import Navbar from '@/app/component/navbar';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/dal/user.dal';
import Loading from '../../component/loading';
import { IUser } from '@/lib/models/user.interface';
import { useParams } from 'next/navigation';

export default function AccountDetails() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		birthDate: '',
		username: '',
	});

	const [isTourActive, setIsTourActive] = useState(false);

	const [user, setUser] = useState<IUser | undefined>(undefined);

	const toggleExplanation = () => {
		setIsTourActive(false);
		setIsTourActive(true);
	};

	const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
	const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
		'pending'
	);
	const [error, setError] = useState<Error | null>(null);

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
    const userName = useParams().username as string;

	const [visibleFriendsCount, setVisibleFriendsCount] = useState(4);

	const handleShowMore = () => {
		setVisibleFriendsCount((prevCount) =>
			prevCount === friends.length ? 4 : friends.length
		);
	};

	useEffect(() => {
		async function fetchUser() {
			setProfilePhoto('');
			setStatus('pending');
			try {
				const user = await getUser(userName);
				if (user) {
					setUser(user);
					const birthdate = new Date(user.birthdate);
					const formattedBirthDate = birthdate
						.toISOString()
						.split('T')[0];
					setFormData({
						username: user.userName,
						firstName: user.firstName,
						lastName: user.lastName,
						birthDate: formattedBirthDate,
					});
					setStatus('success');
				} else {
					throw new Error('Username not found');
				}
			} catch (e) {
				console.log(e);
				setStatus('error');
				setError(e as Error);
			}
		}
		fetchUser();
	}, []);

	

	if (status === 'pending') {
		return <Loading />;
	}
	if (status === 'error') return <h1>Error! {error?.message}</h1>;

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 flex flex-col items-center px-4">
				<main className="w-full max-w-8xl grid grid-cols-1 lg:grid-cols-2 gap-8 px-12 mt-10">
					<div className="details bg-white px-8 py-11 rounded-lg shadow-md h-[725px]">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-3xl font-semibold">Mijn gegevens</h2>
						</div>
						<div className="mb-6">
							<div className="text-lg font-medium text-gray-700 mb-1">Voornaam</div>
							<div className="text-xl">{formData.firstName}</div>
						</div>
						<div className="mb-6">
							<div className="text-lg font-medium text-gray-700 mb-1">Achternaam</div>
							<div className="text-xl">{formData.lastName}</div>
						</div>
						<div className="mb-6">
							<div className="text-lg font-medium text-gray-700 mb-1">Geboortedatum</div>
							<div className="text-xl">{formData.birthDate}</div>
						</div>
						<div className="mb-6">
							<div className="text-lg font-medium text-gray-700 mb-1">Gebruikersnaam</div>
							<div className="text-xl">{formData.username}</div>
						</div>
					</div>
					<div className="friends-list bg-white p-8 rounded-lg shadow-md">
						<div className="flex items-center justify-between mb-5">
							<h2 className="text-3xl font-semibold">Vrienden</h2>
							<button
								onClick={toggleExplanation}
								className="text-white bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
							>
								?
							</button>
						</div>

						<div className="space-y-6">
							{friends
								.slice(0, visibleFriendsCount)
								.map((friend, index) => (
									<div
										key={index}
										className="friend-item flex items-center justify-between bg-blue-100 p-6 rounded-lg shadow"
									>
										<div className="flex items-center">
											<div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 mr-6"></div>
											<div className="text-xl font-semibold">
												{friend.name}
											</div>
										</div>
										<div
											className={`online-status w-8 h-8 rounded-full ${
												friend.isOnline ? 'bg-green-500' : 'bg-gray-500'
											}`}
										></div>
									</div>
								))}
						</div>
						{friends.length > 4 && (
							<div className="mt-6 text-center">
								<button
									onClick={handleShowMore}
									className="show-more-button px-6 py-3 text-lg bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
								>
									{visibleFriendsCount === friends.length ? 'Toon minder' : 'Toon meer'}
								</button>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}