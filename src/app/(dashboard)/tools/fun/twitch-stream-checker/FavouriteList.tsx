import { FiX, FiSearch } from "react-icons/fi";

interface FavoritesListProps {
    favorites: string[];
    onCheck: (username: string) => void;
    onRemove: (username: string) => void;
}

const FavoritesList = ({
    favorites,
    onCheck,
    onRemove,
}: FavoritesListProps) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-700">
                {favorites.map((username) => (
                    <li
                        key={username}
                        className="flex items-center justify-between p-4 hover:bg-gray-700"
                    >
                        <span className="font-medium">{username}</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onCheck(username)}
                                className="p-1.5 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                aria-label={`Check ${username}'s stream`}
                            >
                                <FiSearch size={18} />
                            </button>
                            <button
                                onClick={() => onRemove(username)}
                                className="p-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                                aria-label={`Remove ${username} from favorites`}
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavoritesList;
