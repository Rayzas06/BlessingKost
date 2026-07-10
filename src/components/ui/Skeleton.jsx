export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="h-8 bg-gray-100" />
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="h-8 w-36 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-44 bg-gray-100 rounded mb-6" />
        <div className="h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonTestimonial() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
      <div className="h-8 w-6 bg-gray-100 rounded mb-3" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

export function SkeletonFacility() {
  return (
    <div className="flex flex-col items-center gap-3 p-5 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-gray-200" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  )
}