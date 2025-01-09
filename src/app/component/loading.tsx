import LoadingNavbar from './loadingnavbar';

export default function Loading() {
	return (
		<>
			<LoadingNavbar />
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300">
				<div className="flex flex-col items-center">
					<div className="relative flex items-center justify-center">
						<div className="loader"></div>
					</div>
					<h1 className="text-white text-2xl font-semibold mt-2">
						Even geduld...
					</h1>
				</div>
			</div>
		</>
	);
}
