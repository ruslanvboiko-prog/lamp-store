import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSlider from './components/hero/HeroSlider';
import FilterPanel from './components/catalog/FilterPanel';
import ProductGrid from './components/catalog/ProductGrid';
import SearchModal from './components/modals/SearchModal';
import ProductModal from './components/modals/ProductModal';
import CartDrawer from './components/drawers/CartDrawer';
import WishlistDrawer from './components/drawers/WishlistDrawer';
import Toast from './components/Toast';

function App() {
  return (
    <div className="min-h-full flex flex-col justify-between bg-[#0B0C10] text-white antialiased">
      <Header />
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-grow">
        <HeroSlider />
        <div className="flex flex-col md:flex-row gap-8">
          <FilterPanel />
          <ProductGrid />
        </div>
      </main>
      <Footer />

      <SearchModal />
      <ProductModal />
      <CartDrawer />
      <WishlistDrawer />
      <Toast />
    </div>
  );
}

export default App;