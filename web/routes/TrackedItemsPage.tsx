import {
    TextField,
    IndexTable,
    Card,
    IndexFilters,
    useSetIndexFiltersMode,
    IndexFiltersMode,
    useIndexResourceState,
    Text,
    ChoiceList,
    RangeSlider,
    Badge,
    Pagination,
    Thumbnail,
    Checkbox,
  } from '@shopify/polaris';
  import type { IndexFiltersProps, TabProps } from '@shopify/polaris';
  import { useState, useCallback } from 'react';
  
  export default function ProductPage() {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState([
      'All',
      'Active',
      'Draft',
      'Archive'
    ]);
    const deleteView = (index: number) => {
      const newItemStrings = [...itemStrings];
      newItemStrings.splice(index, 1);
      setItemStrings(newItemStrings);
      setSelected(0);
    };
  
    const duplicateView = async (name: string) => {
      setItemStrings([...itemStrings, name]);
      setSelected(itemStrings.length);
      await sleep(1);
      return true;
    };
  
    const tabs: TabProps[] = itemStrings.map((item, index) => ({
      content: item,
      index,
      onAction: () => { },
      id: `${item}-${index}`,
      isLocked: index === 0,
      actions:
        index === 0
          ? []
          : [
            {
              type: 'rename',
              onAction: () => { },
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: 'duplicate',
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: 'edit',
            },
            {
              type: 'delete',
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
    }));
    const [selected, setSelected] = useState(0);
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust this as needed
  
    const onCreateNewView = async (value: string) => {
      await sleep(500);
      setItemStrings([...itemStrings, value]);
      setSelected(itemStrings.length);
      return true;
    };
    const sortOptions: IndexFiltersProps['sortOptions'] = [
      { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
      { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
      { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
      { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
      { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
      { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
      { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
      { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
    ];
    const [sortSelected, setSortSelected] = useState(['order asc']);
    const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
    const onHandleCancel = () => { setQueryValue('') };
  
    const onHandleSave = async () => {
      await sleep(1);
      return true;
    };
  
    const primaryAction: IndexFiltersProps['primaryAction'] =
      selected === 0
        ? {
          type: 'save-as',
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
        : {
          type: 'save',
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
    const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
      undefined,
    );
    const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
      undefined,
    );
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState('');
  
  
    const handleAccountStatusChange = useCallback(
      (value: string[]) => setAccountStatus(value),
      [],
    );
    const handleMoneySpentChange = useCallback(
      (value: [number, number]) => setMoneySpent(value),
      [],
    );
    const handleTaggedWithChange = useCallback(
      (value: string) => setTaggedWith(value),
      [],
    );
    const handleFiltersQueryChange = useCallback(
      (value: string) => setQueryValue(value),
      [],
    );
    const handleAccountStatusRemove = useCallback(
      () => setAccountStatus(undefined),
      [],
    );
    const handleMoneySpentRemove = useCallback(
      () => setMoneySpent(undefined),
      [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
      handleAccountStatusRemove();
      handleMoneySpentRemove();
      handleTaggedWithRemove();
      handleQueryValueRemove();
    }, [
      handleAccountStatusRemove,
      handleMoneySpentRemove,
      handleQueryValueRemove,
      handleTaggedWithRemove,
    ]);
  
    const filters = [
      {
        key: 'accountStatus',
        label: 'Account status',
        filter: (
          <ChoiceList
            title="Account status"
            titleHidden
            choices={[
              { label: 'Enabled', value: 'enabled' },
              { label: 'Not invited', value: 'not invited' },
              { label: 'Invited', value: 'invited' },
              { label: 'Declined', value: 'declined' },
            ]}
            selected={accountStatus || []}
            onChange={handleAccountStatusChange}
            allowMultiple
          />
        ),
        shortcut: true,
      },
      {
        key: 'taggedWith',
        label: 'Tagged with',
        filter: (
          <TextField
            label="Tagged with"
            value={taggedWith}
            onChange={handleTaggedWithChange}
            autoComplete="off"
            labelHidden
          />
        ),
        shortcut: true,
      },
      {
        key: 'moneySpent',
        label: 'Money spent',
        filter: (
          <RangeSlider
            label="Money spent is between"
            labelHidden
            value={moneySpent || [0, 500]}
            prefix="$"
            output
            min={0}
            max={2000}
            step={1}
            onChange={handleMoneySpentChange}
          />
        ),
      },
    ];
  
    const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
    if (accountStatus && !isEmpty(accountStatus)) {
      const key = 'accountStatus';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, accountStatus),
        onRemove: handleAccountStatusRemove,
      });
    }
    if (moneySpent) {
      const key = 'moneySpent';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, moneySpent),
        onRemove: handleMoneySpentRemove,
      });
    }
    if (!isEmpty(taggedWith)) {
      const key = 'taggedWith';
      appliedFilters.push({
        key,
        label: disambiguateLabel(key, taggedWith),
        onRemove: handleTaggedWithRemove,
      });
    }
  
    const products = [
      {
        id: '1234567890123',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0657/3968/6087/files/51ThXwpW4lL._AC_UL1000.webp?v=1716930908',
        imageAlt: 'Argentina Jersey',
        title: 'Argentina Jersey',
        customer: 'Nero Wiggins',
        inventory: 10,
        trackInventory: true,
        serialNumber: 499090000
      },
      {
        id: '123232134232',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0657/3968/6087/files/475173.jpg?v=1716930926',
        imageAlt: 'Soccer Ball',
        title: 'Soccer Ball',
        customer: 'Nero Wiggins',
        locationName: 'Warehouse 1',
        orderNumber: 1020,
        inventory: 5,
        trackInventory: false,
        serialNumber: 499090001
      },
      {
        id: '48438348384384',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0657/3968/6087/files/https___hypebeast.com_image_2016_09_nike-hyperdunk-triple-white-1copy.jpg?v=1716930931',
        imageAlt: 'Basketball Shoes',
        title: 'Basketball Shoes',
        customer: 'Nero Wiggins',
        locationName: 'Warehouse 2',
        orderNumber: 1018,
        inventory: 3,
        trackInventory: false,
        serialNumber: 499090002
      },
      {
        id: '594393443433',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0657/3968/6087/files/d20efa73ecfe347ff02e7400376239f6_1200xcopy.jpg?v=1716930911',
        imageAlt: 'Football Gloves',
        title: 'Football Gloves',
        customer: 'Nero Wiggins',
        locationName: 'Warehouse 1',
        orderNumber: 1018,
        inventory: 6,
        trackInventory: false,

        serialNumber: 499090003
      },
      {
        id: '383838434343',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0657/3968/6087/files/letsds_2.webp?v=1716930923',
        imageAlt: 'Hockey Stick',
        title: 'Hockey Stick',
        locationName: 'Warehouse 2',
        orderNumber: 1019,
        inventory: 4,
        trackInventory: false,
        serialNumber: 499090004
      },
    ];
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };
  
    const handlePageChange = (newPage) => setCurrentPage(newPage);
  
    const { selectedResources, allResourcesSelected, handleSelectionChange } =
      useIndexResourceState(products);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
  
    const lowerCaseQueryValue = queryValue.toLowerCase();
  
    const filteredProducts = products.filter(product =>
      Object.values(product).some(value =>
        String(value).toLowerCase().includes(lowerCaseQueryValue)
      )
    );  const pageItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
    const rowMarkup = pageItems.map(
      ({ id, imageSrc, imageAlt, title, trackInventory, serialNumber, locationName, orderNumber, customer }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          
          <IndexTable.Cell>
          
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {serialNumber}
            </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Thumbnail
        source={imageSrc}
        alt={imageAlt}
        size='small'
        />
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {title}
            </Text>
        </IndexTable.Cell>
          <IndexTable.Cell>
            <Text variant="bodyMd" as="span">
              {customer}
            </Text>
          </IndexTable.Cell>
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                {orderNumber}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                {locationName}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text variant="bodyMd" as="span">
                 {''}
                </Text>
            </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
  
  
  
    return (
      <Card>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Filter product variants"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue('')}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          resourceName={resourceName}
          itemCount={filteredProducts.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Serial Number' },
            { title: 'Product Variant' },
            { title: 'Customer' },
            { title: 'Order' },
            { title: 'Location' },
            { title: 'Warranty Expiry Date' },
          ]}
        >
          {rowMarkup}
        </IndexTable>
        <Pagination
          hasPrevious={currentPage > 1}
          onPrevious={() => handlePageChange(currentPage - 1)}
          hasNext={currentPage * itemsPerPage < products.length}
          onNext={() => handlePageChange(currentPage + 1)}
        />
      </Card>
    );
  
    function disambiguateLabel(key: string, value: string | any[]): string {
      switch (key) {
        case 'moneySpent':
          return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
          return `Tagged with ${value}`;
        case 'accountStatus':
          return (value as string[]).map((val) => `Customer ${val}`).join(', ');
        default:
          return value as string;
      }
    }
  
    function isEmpty(value: string | any[]) {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return value === '' || value == null;
      }
    }
  }