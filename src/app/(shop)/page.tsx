import { createClient } from "@/lib/supabase/client";
import { HeroSlider } from "@/components/cms/HeroSlider";
import { CategoryCircles } from "@/components/cms/CategoryCircles";
import { ProductCarousel } from "@/components/cms/ProductCarousel";
import { BannersGrid } from "@/components/cms/BannersGrid";
import { ContentBlock } from "@/types/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;




interface HeroSliderData {
  slides: { image_url: string; title: string; subtitle: string; button_text: string; link: string }[];
}

interface BannersGridData {
  banners: { image_url: string; title: string; link: string }[];
}

interface ProductCarouselData {
  category_id?: string;
  limit?: number;
}

async function getHomepageBlocks() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Supabase Error fetching blocks:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as ContentBlock[];
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export default async function Home() {
  const blocks = await getHomepageBlocks();

  return (
    <div 
        className="flex min-h-screen flex-col bg-[#f9faf6] relative overflow-hidden"
        style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)', 
            backgroundSize: '24px 24px' 
        }}
    >
      <main className="flex-1 relative z-10">
        {blocks.map((block: ContentBlock, index: number) => {
          let content = null;
          switch (block.type) {
            case 'hero_slider':
              content = <HeroSlider data={block.data as unknown as HeroSliderData} />;
              break;
            case 'category_grid':
              content = <CategoryCircles />;
              break;
            case 'banners_grid':
              content = <BannersGrid data={block.data as unknown as BannersGridData} />;
              break;
            case 'product_carousel':
              content = (
                <ProductCarousel
                  title={block.title || 'מוצרים נבחרים'}
                  data={block.data as unknown as ProductCarouselData}
                />
              );
              break;
            case 'text_banner': {
              const bannerData = block.data as unknown as { text?: string; bg_color?: string };
              content = (
                <div className="py-6 px-4 text-center text-lg font-medium" style={{ backgroundColor: bannerData.bg_color || '#f0fdf4' }}>
                  {bannerData.text || ''}
                </div>
              );
              break;
            }
          }
          
          if (!content) return null;

          // Hero, Category Grid, Product Carousel and Banners Grid shouldn't have artificial wrapper padding/bg if they're supposed to be edge-to-edge
          if (block.type === 'hero_slider' || block.type === 'category_grid' || block.type === 'product_carousel' || block.type === 'banners_grid' || block.type === 'text_banner') {
            return <div key={block.id}>{content}</div>;
          }

          // Uniform background handles the styling now
          return (
             <div key={block.id} className="py-2 md:py-3 px-4 md:px-6">
                 {content}
             </div>
          );
        })}
      </main>
    </div>
  );
}
