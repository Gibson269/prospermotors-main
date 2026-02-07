import { Play } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Videos = () => {
  // Sample video data - in production this would come from the database
  const videos = [
    {
      id: '1',
      title: 'Mercedes-Benz S-Class Showcase',
      description: 'Experience the pinnacle of automotive luxury with our Mercedes-Benz S-Class collection.',
      thumbnail: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '2',
      title: 'Range Rover Sport - Ultimate SUV',
      description: 'Discover why the Range Rover Sport remains the benchmark for luxury SUVs.',
      thumbnail: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '3',
      title: 'BMW 7 Series - Driving Excellence',
      description: 'The ultimate driving machine meets uncompromising luxury.',
      thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '4',
      title: 'Porsche Cayenne - Performance Meets Practicality',
      description: 'Sports car DNA in an SUV package.',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '5',
      title: 'Prosperous Autos Showroom Tour',
      description: 'Take a virtual tour of our premium showroom in Abuja.',
      thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: '6',
      title: 'Customer Testimonials',
      description: 'Hear what our valued clients have to say about their experience.',
      thumbnail: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&auto=format',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-obsidian text-white py-24">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">
              Video Gallery
            </p>
            <h1 className="text-display mb-6">Videos</h1>
            <p className="text-platinum/70 text-xl font-light">
              Explore our collection through immersive video showcases.
            </p>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="luxury-card group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-obsidian/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play className="h-6 w-6 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground text-sm">
              Follow us on social media for more video content and updates.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Videos;
