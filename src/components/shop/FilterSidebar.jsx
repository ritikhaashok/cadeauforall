export default function FilterSidebar() {
  return (
    <aside className="w-full md:w-64">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="font-semibold mb-4">Filter by</h4>

        <div className="mb-4">
          <div className="font-medium mb-2">Material</div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Ceramic</label></li>
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Wood</label></li>
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Metal</label></li>
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Glass</label></li>
          </ul>
        </div>

        <div className="mb-4">
          <div className="font-medium mb-2">Size</div>
          <ul className="text-sm text-gray-600 space-y-2">
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Small</label></li>
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Medium</label></li>
            <li><label className="flex items-center gap-2"><input type="checkbox" /> Large</label></li>
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">Price Range</div>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="10" className="w-1/2 border rounded px-2 py-1 text-sm" />
            <input type="number" placeholder="80" className="w-1/2 border rounded px-2 py-1 text-sm" />
          </div>
        </div>
      </div>
    </aside>
  );
}
