import { createClient } from "@/lib/supabase/client";
import { HeroSlider } from "@/components/cms/HeroSlider";
import { CategoryCircles } from "@/components/cms/CategoryCircles";
import { ProductCarousel } from "@/components/cms/ProductCarousel";
import { BannersGrid } from "@/components/cms/BannersGrid";
import { ContentBlock } from "@/types/supabase";



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
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        {blocks.map((block: ContentBlock) => {
          switch (block.type) {
            case 'hero_slider':
              return <HeroSlider key={block.id} data={block.data as unknown as HeroSliderData} />;
            case 'category_grid':
              return <CategoryCircles key={block.id} />;
            case 'banners_grid':
              return <BannersGrid key={block.id} data={block.data as unknown as BannersGridData} />;
            case 'product_carousel':
              return (
                <ProductCarousel
                  key={block.id}
                  title={block.title || 'מוצרים נבחרים'}
                  data={block.data as unknown as ProductCarouselData}
                />
              );
            case 'text_banner': {
              const bannerData = block.data as unknown as { text?: string; bg_color?: string };
              return (
                <div key={block.id} className="py-6 px-4 text-center text-lg font-medium" style={{ backgroundColor: bannerData.bg_color || '#f0fdf4' }}>
                  {bannerData.text || ''}
                </div>
              );
            }
            default:
              return null;
          }
        })}
      </main>
    </div>
  );
}
