import React from 'react';
import Image from 'next/image';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  width?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, width }) => {
  return (
    <div className={styles.searchContainer} style={{width: `${width}px`}}>
      <input
        type="text"
        placeholder="SEARCH..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.searchIcon}>
        <Image src="/assets/icons/icons-16/search.svg" alt="Search Icon" width={24} height={24} />
      </div>
    </div>
  );
};

export default SearchBar;
