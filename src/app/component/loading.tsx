export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300">
			<div className="flex flex-col items-center">
				<div className="loader bg-blue-600 rounded-full w-16 h-16 mb-4 border-t-4 border-white animate-spin"></div>
				<h1 className="text-white text-2xl font-semibold">
					Even geduld...
				</h1>
			</div>

			<style jsx>{`
				.loader {
					border-width: 4px;
				}
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</div>
	);
}
