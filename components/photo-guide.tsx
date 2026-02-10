interface PhotoGuideProps {
  angle: "front" | "left45" | "right45"
}

export function PhotoGuide({ angle }: PhotoGuideProps) {
  return (
    <div className="absolute top-16 right-4 bg-black/70 p-2 rounded-lg z-20">
      <div className="relative w-16 h-16">
        {angle === "front" && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-4 bg-white"></div>
            </div>
          </div>
        )}

        {angle === "left45" && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-4 bg-white transform -rotate-45"></div>
            </div>
          </div>
        )}

        {angle === "right45" && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1 h-4 bg-white transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>
      <div className="text-white text-xs text-center mt-1">
        {angle === "front" && "正面"}
        {angle === "left45" && "左脸45°"}
        {angle === "right45" && "右脸45°"}
      </div>
    </div>
  )
}
