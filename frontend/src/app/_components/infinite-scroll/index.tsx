import React, { useState, useEffect, ReactElement, ComponentType, useCallback, useRef } from 'react';
import InView from '../in-view';
import { Spin } from 'antd';

interface Props {
  hasMore: boolean;
  loadMore: (page: number) => Promise<any[]>;
  isLoading: boolean;
  error: boolean;
  storageKey?: string;
  initialData: any[];
  Element: ComponentType<any>;
  limit?: number;
  className?: string;
  componentExtraProps?: Record<string, any>;
}

const InfiniteScroll: React.FC<Props> = ({
  hasMore,
  initialData,
  loadMore,
  isLoading,
  Element,
  error,
  limit,
  className,
  storageKey,
  componentExtraProps,
}) => {
  const [data, setData] = useState<any[]>(initialData || []);
  const [, setPage] = useState(1);
  const [toFetch, setToFetch] = useState(hasMore)
  const pageCount = useRef(1);

  const saveDataToStorage = (data: any[]) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  };

  const loadDataFromStorage = () => {
    if (storageKey && !initialData) {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      }
    }
  };

  async function loadMoreData(page: number) {
    try {

      const response = await loadMore(page);
      setToFetch(response?.length === (limit || 10));
      const newData = [...data, ...response];
      setData(newData);
      saveDataToStorage(newData);
    } catch (err) {
      console.log(err)
    }
  };

  const action = useCallback(() => {
    if (hasMore && !isLoading && data.length === (limit || 10)) {
      const pageNext = pageCount.current + 1;
      setPage(pageNext);
      loadMoreData(pageNext);
      pageCount.current = pageNext;
    }
  }, [hasMore, isLoading, data, limit]);

  useEffect(() => {
    if (storageKey) {
      loadDataFromStorage();
    }
  }, [storageKey]);
  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);
  return (
    <div className={`flex flex-col gap-4 w-full h-full  ${className}`}>
      {data.map((item, index) => (
        <Element key={index + item._id} {...(componentExtraProps || {})} {...item} />
      ))}
      {isLoading && <div className="text-center animate-ping font-bold text-[23px] text-[#373737] max-w-[270px] mx-auto h-[40px]">...</div>}
      {error && <div>Error loading data</div>}
      {toFetch && !isLoading && action && <InView action={action} />}
    </div>
  );
};

export default InfiniteScroll;
