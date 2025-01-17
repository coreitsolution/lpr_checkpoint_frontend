import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ImagesCarouselProps {
  plate: string,
  vehicleImage: string,
  plateImage: string,
}

const ImagesCarousel: React.FC<ImagesCarouselProps> = ({plate, vehicleImage, plateImage}) => {
  return (
    <Carousel 
      className="w-full max-w-lg text-white"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {
          Array.from({length: 2}).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1 relative">
                <Card>
                  <CardContent className="flex items-center justify-center p-4 w-[500px] h-[50vh]">
                    <img 
                      src={index === 1 ? plateImage : vehicleImage} 
                      alt={index === 1 ? "Plate" : "Vehicle"}  
                      className={`w-full ${index === 1 ? "h-[50%]" : "h-full"}`}
                    />
                  </CardContent>
                </Card>
                <p className="absolute inset-0 flex items-end justify-center text-[30px]">{plate}</p>
              </div>
            </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ImagesCarousel