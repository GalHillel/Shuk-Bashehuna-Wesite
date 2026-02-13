import { createClient } from "@/lib/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import { HeroSlider } from "@/components/cms/HeroSlider";
import { CategoryCircles } from "@/components/cms/CategoryCircles";
import { ProductCarousel } from "@/components/cms/ProductCarousel";
import { BannersGrid } from "@/components/cms/BannersGrid";
import { ContentBlock } from "@/types/supabase";

// Fallback Mock Data for when DB is empty or connection fails
const MOCK_BLOCKS: ContentBlock[] = [
  {
    id: 1, type: 'hero_slider', title: null, sort_order: 10, is_active: true,
    created_at: '', updated_at: '',
    data: {
      slides: [
        {
          image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
          title: 'הפירות הכי מתוקים העונה',
          subtitle: 'ישירות מהחקלאי אליכם לצלחת',
          button_text: 'הזמינו עכשיו',
          link: '/category/fruits'
        },
        {
          image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&auto=format&fit=crop&q=80',
          title: 'ירקות שורש למרקים',
          subtitle: 'חורף חם וטעים עם הירקות של שוק בשכונה',
          button_text: 'למתכוני חורף',
          link: '/category/winter'
        }
      ]
    }
  },
  {
    id: 2, type: 'category_grid', title: null, sort_order: 20, is_active: true,
    created_at: '', updated_at: '', data: {}
  },
  {
    id: 3, type: 'product_carousel', title: 'המבצעים החמים 🔥', sort_order: 30, is_active: true,
    created_at: '', updated_at: '',
    data: { category_id: 'specials', limit: 10 }
  },
  {
    id: 4, type: 'banners_grid', title: null, sort_order: 40, is_active: true,
    created_at: '', updated_at: '',
    data: {
      banners: [
        {
          image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
          title: 'עגבניות סופי',
          link: '/product/tomato-maggie'
        },
        {
          image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&auto=format&fit=crop&q=80',
          title: 'מחלבת בוטיק',
          link: '/category/dairy-eggs'
        }
      ]
    }
  },
  {
    id: 5, type: 'product_carousel', title: 'ירקות טריים יום יום 🥬', sort_order: 50, is_active: true,
    created_at: '', updated_at: '',
    data: { category_id: 'vegetables', limit: 10 }
  }
];

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
      return MOCK_BLOCKS;
    }

    if (!data || data.length === 0) {
      return MOCK_BLOCKS;
    }

    return data as ContentBlock[];
  } catch (err) {
    console.error("Unexpected error:", err);
    return MOCK_BLOCKS;
  }
}

export default async function Home() {
  const blocks = await getHomepageBlocks();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
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
      <Footer />
    </div>
  );
}
