export default function MovieCard({ movie }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4 bg-secondary/10 aspect-[2/3]">
        <img
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
          <div className="p-4 w-full">
            <p className="text-sm text-secondary mb-1">{movie.genre}</p>
            <p className="text-foreground font-bold text-sm">⭐ {movie.rating}/10</p>
          </div>
        </div>
      </div>
      <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition">{movie.title}</h3>
      <p className="text-secondary text-sm mt-1">⏱ {movie.duration} min</p>
    </div>
  )
}
