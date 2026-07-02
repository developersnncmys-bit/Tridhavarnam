import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SAREES } from '@/lib/sarees';
import ProductDetail from '@/components/shop/ProductDetail';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const saree = SAREES.find((s) => s.id === id);
  if (!saree) return { title: 'Not found · Thridha Varnam' };
  return {
    title: `${saree.name} · Thridha Varnam`,
    description: saree.story,
  };
}

export function generateStaticParams() {
  return SAREES.map((s) => ({ id: s.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const saree = SAREES.find((s) => s.id === id);
  if (!saree) notFound();
  return <ProductDetail saree={saree} />;
}
