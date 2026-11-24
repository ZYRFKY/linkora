import { useEffect, useMemo, useRef, useState } from "react";


import {


  Bookmark, Search, Plus, LayoutGrid, List, Star, Folder,


  ArrowUpRight, MoreHorizontal, Pencil, Trash2, X,


  ExternalLink, PanelLeft, Check, FolderPlus, Download, Upload,
  Command


} from "lucide-react";


const DEFAULT_COLLECTIONS = [


  "Productivity",


  "Design",


  "Development",


  "Inspiration",


  "Learning",


  "Other"


];


const INITIAL_BOOKMARKS = [


  {


    id: 1, title: "Linear", url: "https://linear.app",


    category: "Productivity",


    description: "A better way to build products.",


    favorite: true, color: "#5E6AD2"


  },


  {


    id: 2, title: "Figma", url: "https://figma.com",


    category: "Design",


    description: "Where teams design together.",


    favorite: true, color: "#F24E1E"


  },


  {


    id: 3, title: "GitHub", url: "https://github.com",


    category: "Development",


    description: "Build and ship better software.",


    favorite: false, color: "#24292F"


  },


  {


    id: 4, title: "Notion", url: "https://notion.so",


    category: "Productivity",


    description: "A connected workspace for your ideas.",


    favorite: false, color: "#111111"


  },


  {


    id: 5, title: "Unsplash", url: "https://unsplash.com",


    category: "Inspiration",


    description: "Find images that move you.",


    favorite: false, color: "#111111"


  },


  {


    id: 6, title: "MDN Web Docs", url: "https://developer.mozilla.org",


    category: "Development",


    description: "Resources for the open web.",


    favorite: true, color: "#1B1B1B"


  }


];


const EMPTY_FORM = {


  title: "",


  url: "",


  category: "Other",


  description: ""


};


function readStorage(key, fallback) {


  try {


    const value = localStorage.getItem(key);


    return value ? JSON.parse(value) : fallback;


  } catch {


    return fallback;


  }


}


function getDomain(url = "") {


  try {


    return new URL(url).hostname.replace(/^www\./i, "");


  } catch {


    return url;


  }


}


function getFavicon(url) {


  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(getDomain(url))}&sz=64`;


}


function Logo() {


  return (


    <div className="flex items-center gap-2.5">


      <div className="w-8 h-8 rounded-lg bg-[#526B57] flex items-center justify-center text-white">


        <Bookmark size={17} />


      </div>


      <span className="text-[21px] font-semibold tracking-[-1.1px]">


        linkora<span className="text-[#718875]">.</span>


      </span>


    </div>


  );


}


function Favicon({ url, title, color }) {


  const [failed, setFailed] = useState(false);


  useEffect(() => {


    setFailed(false);


  }, [url]);


  if (failed) {


    return (


      <div


        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shrink-0"


        style={{ backgroundColor: color || "#526B57" }}


      >


        {title?.charAt(0)?.toUpperCase() || "?"}


      </div>


    );


  }


  return (


    <div className="w-10 h-10 rounded-xl border border-[#ECEBE5] bg-[#FAF9F5] flex items-center justify-center shrink-0">


      <img


        src={getFavicon(url)}


        alt=""


        className="w-5 h-5 object-contain"


        onError={() => setFailed(true)}


      />


    </div>


  );


}


function SidebarButton({ active, icon: Icon, count, onClick, children }) {


  return (


    <button


      onClick={onClick}


      className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-lg text-[13px] transition-colors ${


        active


          ? "bg-[#EDEFE9] text-[#435B47] font-medium"


          : "text-[#777970] hover:bg-[#F0EFE9] hover:text-[#292B27]"


      }`}


    >


      <Icon size={16} strokeWidth={1.7} />


      {children}


      {count !== undefined && (


        <span className="ml-auto text-[11px] text-[#A2A398]">


          {count}


        </span>


      )}


    </button>


  );


}


function FormField({ label, children }) {


  return (


    <label className="block">


      <span className="block text-[11px] font-medium text-[#686A61] mb-2">


        {label}


      </span>


      {children}


    </label>


  );


}


function CollectionModal({


  mode,


  initialName,


  onClose,


  onSave


}) {


  const [name, setName] = useState(initialName || "");


  const [error, setError] = useState("");


  const submit = (e) => {


    e.preventDefault();


    const cleanName = name.trim();


    if (!cleanName) {


      setError("Collection name cannot be empty.");


      return;


    }


    onSave(cleanName);


  };


  return (


    <div


      className="fixed inset-0 z-[120] bg-[#20231F]/35 backdrop-blur-[3px] flex items-center justify-center p-4"


      onMouseDown={e => {


        if (e.target === e.currentTarget) onClose();


      }}


    >


      <div className="w-full max-w-[420px] bg-[#FBFAF6] border border-[#E8E7DF] rounded-xl shadow-2xl p-6 sm:p-8">


        <div className="flex items-start justify-between mb-7">


          <div>


            <p className="text-[10px] uppercase tracking-[1.8px] text-[#82977E] font-semibold mb-2">


              Organize your library


            </p>


            <h2 className="text-[22px] font-semibold tracking-[-0.8px]">


              {mode === "rename" ? "Rename collection" : "Create a collection"}


            </h2>


            <p className="text-[12px] text-[#92948A] mt-1">


              Give your saved links a place to belong.


            </p>


          </div>


          <button


            onClick={onClose}


            className="p-2 rounded-lg hover:bg-[#EFEEE8] text-[#777970]"


            aria-label="Close"


          >


            <X size={18} />


          </button>


        </div>


        <form onSubmit={submit} className="space-y-5">


          <FormField label="Collection name">


            <input


              autoFocus


              value={name}


              onChange={e => {


                setName(e.target.value);


                setError("");


              }}


              placeholder="e.g. Creative Inspiration"


              className="form-input"


              maxLength={35}


            />


          </FormField>


          {error && (


            <p className="text-[11px] text-[#A75B51]">{error}</p>


          )}


          <div className="flex gap-3 pt-2">


            <button


              type="button"


              onClick={onClose}


              className="flex-1 border border-[#E2E2DA] rounded-lg py-3 text-[12px] font-medium hover:bg-[#F0EFE9]"


            >


              Cancel


            </button>


            <button


              type="submit"


              className="flex-1 bg-[#526B57] hover:bg-[#435B47] text-white rounded-lg py-3 text-[12px] font-medium"


            >


              {mode === "rename" ? "Save changes" : "Create collection"}


            </button>


          </div>


        </form>


      </div>


    </div>


  );


}


function BookmarkItem({


  item,


  view,


  menuOpen,


  onMenu,


  onEdit,


  onDelete,


  onFavorite


}) {


  const isList = view === "list";


  return (


    <article


      className={


        isList


          ? "group relative flex items-center gap-3 sm:gap-5 py-4 border-b border-[#E6E6DE] hover:bg-[#F1F1EB]/60 transition-colors px-2"


          : "group relative bg-[#FBFAF6] border border-[#E7E7DF] rounded-xl p-4 hover:border-[#B9C7B7] transition-colors"


      }


    >


      <Favicon url={item.url} title={item.title} color={item.color} />


      <div className={`min-w-0 flex-1 ${


        isList


          ? "flex flex-col sm:flex-row sm:items-center sm:gap-6"


          : "mt-4"


      }`}>


        <div className="min-w-0 sm:w-[180px] shrink-0">


          <h3 className="text-[13px] font-semibold text-[#30322D] truncate">


            {item.title}


          </h3>


          <p className="text-[10px] text-[#96978D] mt-1 truncate">


            {getDomain(item.url)}


          </p>


        </div>


        <p className={`text-[11px] text-[#85877D] leading-relaxed truncate ${


          isList ? "hidden md:block flex-1" : "mt-3 min-h-[30px]"


        }`}>


          {item.description || "No note added."}


        </p>


        <div className={`flex items-center gap-2 ${


          isList


            ? "mt-2 sm:mt-0 sm:w-[130px] shrink-0"


            : "mt-4"


        }`}>


          <span className="text-[10px] bg-[#ECEFE9] text-[#526B57] px-2.5 py-1 rounded-full whitespace-nowrap">


            {item.category}


          </span>


        </div>


      </div>


      <div className={`flex items-center gap-1 shrink-0 ${


        isList ? "" : "absolute right-3 top-3"


      }`}>


        <button


          onClick={onFavorite}


          title="Toggle favorite"


          className="p-2 rounded-lg text-[#999B91] hover:bg-[#ECEFE9] hover:text-[#526B57]"


        >


          <Star


            size={15}


            className={item.favorite ? "fill-[#82977E] text-[#526B57]" : ""}


          />


        </button>


        <div className="relative">


          <button


            onClick={onMenu}


            title="More options"


            className="p-2 rounded-lg text-[#999B91] hover:bg-[#ECEFE9]"


          >


            <MoreHorizontal size={17} />


          </button>


          {menuOpen && (


            <>


              <button


                aria-label="Close menu"


                onClick={onMenu}


                className="fixed inset-0 z-10 cursor-default"


              />


              <div className="absolute right-0 top-9 z-20 w-40 bg-[#FBFAF6] border border-[#E7E7DF] rounded-lg shadow-xl p-1">


                <a


                  href={item.url}


                  target="\_blank"


                  rel="noopener noreferrer"


                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-[#66685F] rounded-md hover:bg-[#F0EFE9]"


                >


                  <ExternalLink size={13} /> Open website


                </a>


                <button


                  onClick={onEdit}


                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] text-[#66685F] rounded-md hover:bg-[#F0EFE9]"


                >


                  <Pencil size={13} /> Edit bookmark


                </button>


                <div className="h-px bg-[#EAEAE3] my-1" />


                <button


                  onClick={onDelete}


                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] text-[#A75B51] rounded-md hover:bg-[#F7EDE9]"


                >


                  <Trash2 size={13} /> Delete


                </button>


              </div>


            </>


          )}


        </div>


        <a


          href={item.url}


          target="\_blank"


          rel="noopener noreferrer"


          aria-label={`Visit ${item.title}`}


          className="hidden sm:flex p-2 rounded-lg text-[#92948A] hover:text-[#526B57] hover:bg-[#ECEFE9]"


        >


          <ArrowUpRight size={15} />


        </a>


      </div>


    </article>


  );


}


function App() {


  const [bookmarks, setBookmarks] = useState(() =>


    readStorage("linkora-bookmarks", INITIAL_BOOKMARKS)


  );


  const [collections, setCollections] = useState(() => {


    const saved = readStorage("linkora-collections", []);


    const oldBookmarks = readStorage("linkora-bookmarks", INITIAL_BOOKMARKS);


    const oldCategories = oldBookmarks.map(item => item.category);


    return [...new Set([


      ...DEFAULT_COLLECTIONS,


      ...saved,


      ...oldCategories


    ])];


  });


  const [page, setPage] = useState("All bookmarks");


  const [activeCategory, setActiveCategory] = useState("All");


  const [search, setSearch] = useState("");


  const [view, setView] = useState("grid");


  const [sort, setSort] = useState("newest");


  const [modalOpen, setModalOpen] = useState(false);


  const [editingId, setEditingId] = useState(null);


  const [menuId, setMenuId] = useState(null);


  const [mobileSidebar, setMobileSidebar] = useState(false);


  const [form, setForm] = useState(EMPTY_FORM);


  const [collectionModal, setCollectionModal] = useState(null);
  const searchInputRef = useRef(null);
  const importInputRef = useRef(null);

  // Keyboard shortcuts: Ctrl/Cmd + K to search, N to add, Escape to close.
  useEffect(() => {
    const handleKeyDown = event => {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      );
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      } else if (!isTyping && !event.ctrlKey && !event.metaKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        openAddModal();
      } else if (event.key === "Escape") {
        setModalOpen(false);
        setCollectionModal(null);
        setMenuId(null);
        setMobileSidebar(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collections]);


  useEffect(() => {


    localStorage.setItem("linkora-bookmarks", JSON.stringify(bookmarks));


  }, [bookmarks]);


  useEffect(() => {


    localStorage.setItem("linkora-collections", JSON.stringify(collections));


  }, [collections]);


  const favoritesCount = bookmarks.filter(item => item.favorite).length;


  const filteredBookmarks = useMemo(() => {


    let result = bookmarks.filter(item => {


      const query = search.trim().toLowerCase();


      const matchesSearch =


        !query ||
        (item.title || "").toLowerCase().includes(query) ||
        (item.url || "").toLowerCase().includes(query) ||
        getDomain(item.url || "").toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query);


      const matchesPage = page !== "Favorites" || item.favorite;


      const matchesCategory =


        activeCategory === "All" || item.category === activeCategory;


      return matchesSearch && matchesPage && matchesCategory;


    });


    if (sort === "alphabetical") {


      result.sort((a, b) => a.title.localeCompare(b.title));


    } else if (sort === "oldest") {


      result.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : Number(a.id) || 0;
        const dateB = b.date ? new Date(b.date).getTime() : Number(b.id) || 0;
        return dateA - dateB;
      });


    } else if (sort === "newest") {


      result.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : Number(a.id) || 0;
        const dateB = b.date ? new Date(b.date).getTime() : Number(b.id) || 0;
        return dateB - dateA;
      });


    }


    return result;


  }, [bookmarks, search, page, activeCategory, sort]);


  const pageTitle =


    page === "All bookmarks"


      ? activeCategory === "All" ? "All bookmarks" : activeCategory


      : page;


  const pageDescription =


    page === "Favorites"


      ? "The places you keep coming back to."


      : page === "Overview"


        ? "A little space for everything worth keeping."


        : "Everything you have saved, all in one place.";


  const navigate = (nextPage, nextCategory = "All") => {


    setPage(nextPage);


    setActiveCategory(nextCategory);


    setSearch("");


    setMobileSidebar(false);


  };


  const openAddModal = () => {


    setEditingId(null);


    setForm({


      ...EMPTY_FORM,


      category: collections.includes("Other") ? "Other" : collections[0]


    });


    setModalOpen(true);


    setMenuId(null);


  };


  const openEditModal = item => {


    setEditingId(item.id);


    setForm({


      title: item.title,


      url: item.url,


      category: item.category,


      description: item.description || ""


    });


    setModalOpen(true);


    setMenuId(null);


  };


  const exportBackup = () => {
    const backup = {
      app: "Linkora",
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks,
      collections
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `linkora-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importBackup = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.bookmarks) || !Array.isArray(parsed.collections)) {
        throw new Error("Invalid backup format");
      }
      const validBookmarks = parsed.bookmarks.filter(item =>
        item && typeof item.title === "string" && typeof item.url === "string"
      ).map((item, index) => ({
        ...item,
        id: item.id ?? Date.now() + index,
        category: item.category || "Other",
        favorite: Boolean(item.favorite),
        description: item.description || ""
      }));
      if (!window.confirm(`Import ${validBookmarks.length} bookmarks? This will replace the current Linkora library.`)) return;
      const safeCollections = [...new Set([
        ...DEFAULT_COLLECTIONS,
        ...parsed.collections.filter(name => typeof name === "string" && name.trim()).map(name => name.trim()),
        ...validBookmarks.map(item => item.category)
      ])];
      setBookmarks(validBookmarks);
      setCollections(safeCollections);
      setPage("All bookmarks");
      setActiveCategory("All");
      setSearch("");
      setSort("newest");
      window.alert("Backup imported successfully.");
    } catch {
      window.alert("Could not import this file. Please choose a valid Linkora JSON backup.");
    } finally {
      event.target.value = "";
    }
  };

const saveBookmark = event => {


  event.preventDefault();


  let url = form.url.trim();


  if (!/^https?:\/\//i.test(url)) {


    url = `https://${url}`;


  }


  try {


    const parsed = new URL(url);


    if (!["http:", "https:"].includes(parsed.protocol)) {


      throw new Error("Invalid URL");


    }


  } catch {


    window.alert("Please enter a valid website URL.");


    return;


  }


  if (!form.title.trim()) return;


  if (editingId !== null) {


    setBookmarks(old =>


      old.map(item =>


        item.id === editingId


          ? {


              ...item,


              ...form,


              title: form.title.trim(),


              url


            }


          : item


      )


    );


  } else {


    const newBookmark = {


      ...form,


      title: form.title.trim(),


      url,


      id: Date.now(),


      date: new Date().toISOString(),


      favorite: false,


      color: "#526B57"


    };


    setBookmarks(old => [newBookmark, ...old]);


  }


  // Tampilkan bookmark langsung setelah disimpan


  setPage("All bookmarks");


  setActiveCategory("All");


  setSearch("");


  setSort("newest");


  // Tutup modal dan reset form


  setModalOpen(false);


  setEditingId(null);


  setForm(EMPTY_FORM);


};


  const deleteBookmark = id => {


    const item = bookmarks.find(bookmark => bookmark.id === id);


    if (window.confirm(`Delete "${item?.title}" from your bookmarks?`)) {


      setBookmarks(old => old.filter(bookmark => bookmark.id !== id));


    }


    setMenuId(null);


  };


  const toggleFavorite = id => {


    setBookmarks(old =>


      old.map(item =>


        item.id === id


          ? { ...item, favorite: !item.favorite }


          : item


      )


    );


  };


  // CREATE COLLECTION


  const createCollection = name => {


    const exists = collections.some(


      item => item.toLowerCase() === name.toLowerCase()


    );


    if (exists) {


      window.alert("This collection already exists.");


      return;


    }


    setCollections(old => [...old, name]);


    setCollectionModal(null);


  };


  // RENAME COLLECTION


  const renameCollection = (oldName, newName) => {


    const exists = collections.some(


      item =>


        item.toLowerCase() === newName.toLowerCase() &&


        item !== oldName


    );


    if (exists) {


      window.alert("This collection already exists.");


      return;


    }


    setCollections(old =>


      old.map(item => item === oldName ? newName : item)


    );


    setBookmarks(old =>


      old.map(item =>


        item.category === oldName


          ? { ...item, category: newName }


          : item


      )


    );


    if (activeCategory === oldName) {


      setActiveCategory(newName);


    }


    setCollectionModal(null);


  };


  // DELETE COLLECTION


  const deleteCollection = name => {


    if (name === "Other") {


      window.alert("The Other collection cannot be deleted.");


      return;


    }


    const confirmed = window.confirm(


      `Delete "${name}"? Its bookmarks will be moved to Other.`


    );


    if (!confirmed) return;


    setCollections(old => old.filter(item => item !== name));


    setBookmarks(old =>


      old.map(item =>


        item.category === name


          ? { ...item, category: "Other" }


          : item


      )


    );


    if (activeCategory === name) {


      setActiveCategory("All");


    }


  };


  const stats = [


    { label: "Saved links", value: bookmarks.length },


    { label: "Favorites", value: favoritesCount },


    { label: "Collections", value: collections.length }


  ];


  return (


    <div className="min-h-screen bg-[#F7F7F3] text-[#292B27]">


      {/* MOBILE HEADER */}


      <header className="lg:hidden h-[68px] px-5 flex items-center justify-between border-b border-[#EAEAE3] bg-[#FBFAF6]">


        <Logo />


        <button


          onClick={() => setMobileSidebar(!mobileSidebar)}


          className="p-2 rounded-lg hover:bg-[#EFEEE8]"


          aria-label="Toggle sidebar"


        >


          <PanelLeft size={20} />


        </button>


      </header>


      <div className="flex min-h-screen">


        {mobileSidebar && (


          <button


            aria-label="Close sidebar"


            onClick={() => setMobileSidebar(false)}


            className="fixed inset-0 z-40 bg-black/20 lg:hidden"


          />


        )}


        {/* SIDEBAR */}


        <aside className={`


          fixed lg:sticky top-0 left-0 z-50


          w-[244px] h-screen bg-[#FBFAF6]


          border-r border-[#EAEAE3]


          px-5 py-6 flex flex-col


          transition-transform duration-200


          ${mobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}


        `}>


          <Logo />


          <div className="mt-12">


            <p className="text-[10px] font-semibold tracking-[1.8px] text-[#999B91] px-3 mb-3">


              LIBRARY


            </p>


            <nav className="space-y-1">


              <SidebarButton


                active={page === "Overview"}


                icon={LayoutGrid}


                onClick={() => navigate("Overview")}


              >


                Overview


              </SidebarButton>


              <SidebarButton


                active={page === "All bookmarks" && activeCategory === "All"}


                icon={Bookmark}


                count={bookmarks.length}


                onClick={() => navigate("All bookmarks")}


              >


                All bookmarks


              </SidebarButton>


              <SidebarButton


                active={page === "Favorites"}


                icon={Star}


                count={favoritesCount}


                onClick={() => navigate("Favorites")}


              >


                Favorites


              </SidebarButton>


            </nav>


          </div>


          {/* COLLECTIONS SIDEBAR */}


          <div className="mt-10">


            <div className="flex items-center justify-between px-3 mb-3">


              <p className="text-[10px] font-semibold tracking-[1.8px] text-[#999B91]">


                COLLECTIONS


              </p>


              <button


                onClick={() => setCollectionModal({


                  mode: "create",


                  name: ""


                })}


                title="Create collection"


                className="p-1.5 rounded-md text-[#92948A] hover:text-[#526B57] hover:bg-[#ECEFE9]"


              >


                <Plus size={15} />


              </button>


            </div>


            <nav className="space-y-1">


              <SidebarButton


                active={page === "All bookmarks" && activeCategory === "All"}


                icon={Folder}


                onClick={() => navigate("All bookmarks")}


              >


                All collections


              </SidebarButton>


              {collections.map(cat => (


                <div key={cat} className="group flex items-center gap-1">


                  <button


                    onClick={() => navigate("All bookmarks", cat)}


                    className={`flex-1 min-w-0 flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] transition-colors ${


                      activeCategory === cat && page === "All bookmarks"


                        ? "bg-[#EDEFE9] text-[#435B47] font-medium"


                        : "text-[#777970] hover:bg-[#F0EFE9] hover:text-[#292B27]"


                    }`}


                  >


                    <span className="w-1.5 h-1.5 rounded-full bg-[#91A28E] shrink-0" />


                    <span className="truncate">{cat}</span>


                    <span className="ml-auto text-[11px] text-[#A4A49A]">


                      {bookmarks.filter(item => item.category === cat).length || ""}


                    </span>


                  </button>


                  <div className="hidden group-hover:flex items-center shrink-0">


                    <button


                      onClick={() => setCollectionModal({


                        mode: "rename",


                        name: cat


                      })}


                      title="Rename collection"


                      className="p-1.5 text-[#92948A] hover:text-[#526B57]"


                    >


                      <Pencil size={12} />


                    </button>


                    {cat !== "Other" && (


                      <button


                        onClick={() => deleteCollection(cat)}


                        title="Delete collection"


                        className="p-1.5 text-[#92948A] hover:text-[#A75B51]"


                      >


                        <Trash2 size={12} />


                      </button>


                    )}


                  </div>


                </div>


              ))}


            </nav>


          </div>


          <div className="mt-auto border-t border-[#EAEAE3] pt-5 px-3">


            <p className="text-[11px] text-[#A0A196] leading-relaxed">


              A quieter place for the things you find online.


            </p>


            <p className="text-[10px] text-[#B0B0A6] mt-3">


              LINKORA · VERSION 2.1


            </p>


          </div>


        </aside>


        {/* MAIN */}


        <main className="flex-1 min-w-0">


          <header className="hidden lg:flex h-[65px] items-center justify-between px-9 border-b border-[#EAEAE3] bg-[#FBFAF6]">


            <div className="flex items-center gap-2 text-[12px] text-[#999B91]">


              <span>Library</span>


              <span>/</span>


              <span className="text-[#55574F]">{pageTitle}</span>


            </div>


            <div className="flex items-center gap-2 text-[11px] text-[#999B91]">


              <span className="w-1.5 h-1.5 rounded-full bg-[#82977E]" />


              Everything saved locally


            </div>


          </header>


          <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-11 py-9 lg:py-12">


            {/* PAGE HEADING */}


            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">


              <div>


                <div className="flex items-center gap-2 mb-4">


                  <span className="w-5 h-px bg-[#82977E]" />


                  <p className="text-[10px] uppercase tracking-[2px] text-[#85877D] font-medium">


                    Your digital library


                  </p>


                </div>


                <h1 className="font-semibold tracking-[-1.8px] text-[36px] sm:text-[43px] leading-tight">


                  {page === "Overview" ? "A place to return to." : pageTitle}


                </h1>


                <p className="text-[13px] sm:text-sm text-[#85877D] mt-3 max-w-lg leading-relaxed">


                  {pageDescription}


                </p>


              </div>


              <button


                onClick={openAddModal}


                className="inline-flex items-center justify-center gap-2 bg-[#526B57] hover:bg-[#435B47] text-white px-4 py-3 rounded-lg text-[12px] font-medium transition-colors self-start md:self-auto"


              >


                <Plus size={16} />


                Save a link


              </button>


            </section>


            {/* OVERVIEW */}


            {page === "Overview" && (


              <section className="grid grid-cols-3 border-y border-[#E5E5DD] py-5 mb-9">


                {stats.map((stat, index) => (


                  <div


                    key={stat.label}


                    className={index !== 0 ? "border-l border-[#E5E5DD] pl-5 sm:pl-8" : ""}


                  >


                    <p className="text-[10px] sm:text-[11px] text-[#92948A]">


                      {stat.label}


                    </p>


                    <p className="text-[25px] sm:text-[30px] font-semibold tracking-[-1px] mt-1">


                      {stat.value.toString().padStart(2, "0")}


                    </p>


                  </div>


                ))}


              </section>


            )}


            {/* TOOLBAR */}


            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">


              <div className="relative w-full sm:max-w-[400px]">


                <Search


                  size={16}


                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9C91]"


                />


                <input
                  ref={searchInputRef}
                  value={search}


                  onChange={e => setSearch(e.target.value)}


                  placeholder="Find something... (Ctrl + K)"


                  className="w-full h-10 pl-10 pr-10 bg-transparent border border-[#E3E3DB] rounded-lg text-[12px] placeholder:text-[#A5A69D] outline-none focus:border-[#82977E] transition-colors"


                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#92948A] hover:bg-[#ECEFE9] hover:text-[#435B47]"
                  >
                    <X size={14} />
                  </button>
                )}


              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={importBackup}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={exportBackup}
                  title="Export Linkora backup"
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#E5E5DD] text-[10px] text-[#777970] hover:bg-[#ECEFE9] hover:text-[#435B47]"
                >
                  <Download size={13} /> Export
                </button>
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  title="Import Linkora backup"
                  className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#E5E5DD] text-[10px] text-[#777970] hover:bg-[#ECEFE9] hover:text-[#435B47]"
                >
                  <Upload size={13} /> Import
                </button>
                <div className="flex items-center justify-between sm:justify-end gap-4">


                <span className="text-[11px] text-[#96978D]">


                  {filteredBookmarks.length} items


                </span>


                <div className="flex items-center gap-1 border border-[#E5E5DD] rounded-lg p-1">


                  <button


                    onClick={() => setView("grid")}


                    title="Grid view"


                    className={`p-1.5 rounded-md ${


                      view === "grid"


                        ? "bg-[#E8ECE5] text-[#435B47]"


                        : "text-[#92948A] hover:text-[#292B27]"


                    }`}


                  >


                    <LayoutGrid size={15} />


                  </button>


                  <button


                    onClick={() => setView("list")}


                    title="List view"


                    className={`p-1.5 rounded-md ${


                      view === "list"


                        ? "bg-[#E8ECE5] text-[#435B47]"


                        : "text-[#92948A] hover:text-[#292B27]"


                    }`}


                  >


                    <List size={16} />


                  </button>


                </div>


                <select


                  value={sort}


                  onChange={e => setSort(e.target.value)}


                  aria-label="Sort bookmarks"


                  className="bg-transparent text-[11px] text-[#777970] outline-none cursor-pointer max-w-[105px]"


                >


                  <option value="newest">Newest first</option>


                  <option value="oldest">Oldest first</option>


                  <option value="alphabetical">A to Z</option>


                </select>
                </div>
              </div>

            </section>


            {/* BOOKMARKS */}


            {filteredBookmarks.length > 0 ? (


              <section


                className={


                  view === "grid"


                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"


                    : "flex flex-col border-t border-[#E6E6DE]"


                }


              >


                {filteredBookmarks.map(item => (


                  <BookmarkItem


                    key={item.id}


                    item={item}


                    view={view}


                    menuOpen={menuId === item.id}


                    onMenu={() => setMenuId(menuId === item.id ? null : item.id)}


                    onEdit={() => openEditModal(item)}


                    onDelete={() => deleteBookmark(item.id)}


                    onFavorite={() => toggleFavorite(item.id)}


                  />


                ))}


              </section>


            ) : (


              <div className="border-y border-[#E6E6DE] py-20 text-center">


                <div className="w-11 h-11 rounded-full bg-[#ECEFE9] text-[#526B57] flex items-center justify-center mx-auto mb-4">


                  <Bookmark size={19} />


                </div>


                <h3 className="text-[16px] font-semibold tracking-tight">


                  Nothing here just yet.


                </h3>


                <p className="text-[12px] text-[#92948A] mt-2">


                  Try another search or save something new.


                </p>


                <button


                  onClick={openAddModal}


                  className="mt-5 text-[12px] text-[#526B57] font-medium hover:underline"


                >


                  Save your first link


                </button>


              </div>


            )}


            <footer className="mt-16 pt-5 border-t border-[#E6E6DE] flex flex-col sm:flex-row items-center justify-between gap-2">


              <p className="text-[10px] text-[#A0A196]">


                Made for the curious.


              </p>


              <p className="text-[10px] text-[#A0A196]">


                LINKORA © 2026


              </p>


            </footer>


          </div>


        </main>


      </div>


      {/* ADD / EDIT BOOKMARK MODAL */}


      {modalOpen && (


        <div


          className="fixed inset-0 z-[100] bg-[#20231F]/35 backdrop-blur-[3px] flex items-center justify-center p-4"


          onMouseDown={e => {


            if (e.target === e.currentTarget) setModalOpen(false);


          }}


        >


          <div className="w-full max-w-[460px] bg-[#FBFAF6] border border-[#E8E7DF] rounded-xl shadow-2xl p-6 sm:p-8">


            <div className="flex items-start justify-between mb-7">


              <div>


                <p className="text-[10px] uppercase tracking-[1.8px] text-[#82977E] font-semibold mb-2">


                  Your collection


                </p>


                <h2 className="text-[23px] font-semibold tracking-[-0.8px]">


                  {editingId !== null ? "Edit bookmark" : "Save something good."}


                </h2>


                <p className="text-[12px] text-[#92948A] mt-1">


                  Keep a little piece of the internet.


                </p>


              </div>


              <button


                onClick={() => setModalOpen(false)}


                className="p-2 rounded-lg hover:bg-[#EFEEE8] text-[#777970]"


                aria-label="Close dialog"


              >


                <X size={18} />


              </button>


            </div>


            <form onSubmit={saveBookmark} className="space-y-4">


              <FormField label="Name">


                <input


                  required


                  autoFocus


                  value={form.title}


                  onChange={e => setForm({ ...form, title: e.target.value })}


                  placeholder="e.g. A beautiful website"


                  className="form-input"


                />


              </FormField>


              <FormField label="Website address">


                <input


                  required


                  value={form.url}


                  onChange={e => setForm({ ...form, url: e.target.value })}


                  placeholder="https://example.com"


                  className="form-input"


                />


              </FormField>


              <FormField label="Collection">


                <select


                  value={form.category}


                  onChange={e => setForm({ ...form, category: e.target.value })}


                  className="form-input bg-[#FBFAF6]"


                >


                  {collections.map(cat => (


                    <option key={cat} value={cat}>{cat}</option>


                  ))}


                </select>


              </FormField>


              <FormField label="A note (optional)">


                <textarea


                  rows="3"


                  value={form.description}


                  onChange={e => setForm({ ...form, description: e.target.value })}


                  placeholder="Why do you want to remember this?"


                  className="form-input resize-none"


                />


              </FormField>


              <div className="flex gap-3 pt-3">


                <button


                  type="button"


                  onClick={() => setModalOpen(false)}


                  className="flex-1 border border-[#E2E2DA] rounded-lg py-3 text-[12px] font-medium hover:bg-[#F0EFE9]"


                >


                  Cancel


                </button>


                <button


                  type="submit"


                  className="flex-1 bg-[#526B57] hover:bg-[#435B47] text-white rounded-lg py-3 text-[12px] font-medium"


                >


                  {editingId !== null ? "Save changes" : "Save bookmark"}


                </button>


              </div>


            </form>


          </div>


        </div>


      )


      }


      {/* CREATE / RENAME COLLECTION MODAL */}


      {collectionModal && (


        <CollectionModal


          mode={collectionModal.mode}


          initialName={collectionModal.name}


          onClose={() => setCollectionModal(null)}


          onSave={name => {


            if (collectionModal.mode === "rename") {


              renameCollection(collectionModal.name, name);


            } else {


              createCollection(name);


            }


          }}


        />


      )}


    </div>


  );

}


export default App;
