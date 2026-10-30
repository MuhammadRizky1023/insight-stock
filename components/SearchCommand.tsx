import { searchStocks } from "@/lib/actions/finnhub.action";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp} from "lucide-react";
import Link from "next/link";
import {useDebounce} from "@/app/hook/useDebounce";

export default function SearchCommand ({renderAs= 'button', label= 'Add stock', initialStocks}:SearchCommandProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [stock, setStock] = useState<StockWithWatchlistStatus[]>(initialStocks)

    const isSearchMode = !searchTerm.trim(); 
    const displayStock = isSearchMode ? stock : stock?.slice(0, 10);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"){
                e.preventDefault()
                setOpen(v=>!v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, []);

    const handlerSearch = async () => {
         if(!isSearchMode) return setStock(initialStocks);
         setLoading(true);
         try {
            const result = await searchStocks(searchTerm.trim())
            setStock(result);
         } catch {
            setStock([]);
         } finally {
            setLoading(false);
         }
      
    }

    const debounce = useDebounce(handlerSearch, 300);

    useEffect(() => {
      debounce();
    }, [searchStocks])
    

    const handleSelectStock = () => {
      setOpen(false);
      setSearchTerm("");
      setStock(initialStocks);
    }

    return(
        <div>
          {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
          ): (
              <Button onClick={() => setOpen(true)} className="search-btn">
                {label}
              </Button>
          )}
          <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
            <div className="search-field">
              <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
              {loading && <Loader2 className="search-loader" />}
            </div>
            <CommandList className="search-list">
              {loading ? (
                  <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
              ) : displayStock?.length === 0 ? (
                  <div className="search-list-indicator">
                    {isSearchMode ? 'No results found' : 'No stocks available'}
                  </div>
                ) : (
                <ul>
                  <div className="search-count">
                    {isSearchMode ? 'Search results' : 'Popular stocks'}
                    {` `}({displayStock?.length || 0})
                  </div>
                  {displayStock?.map((stock, i) => (
                      <li key={stock.symbol} className="search-item">
                        <Link
                            href={`/stocks/${stock.symbol}`}
                            onClick={handleSelectStock}
                            className="search-item-link"
                        >
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <div  className="flex-1">
                            <div className="search-item-name">
                              {stock.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.symbol} | {stock.exchange } | {stock.type}
                            </div>
                          </div>
                        </Link>
                      </li>
                  ))}
                </ul>
              )
              }
            </CommandList>
          </CommandDialog>
        </div>
    )
    
}