import {
    IndexTable,
    useIndexResourceState,
    Text,
    Box,
    Badge,
    Card,
    TextField,
} from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import React, { useState } from 'react';

export default function OrderPage() {
    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
            paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
    ];
    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = orders.filter((order) =>
        Object.values(order).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const rowMarkup = filteredOrders.map(
        (
            { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {order}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{date}</IndexTable.Cell>
                <IndexTable.Cell>{customer}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="end" numeric>
                        {total}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
                <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const promotedBulkActions = [
        {
            content: 'Seriaize Items',
            onAction: () => console.log('Todo: implement redirect to Serialization'),
        },
        {
            content: 'Print',
            onAction: () => console.log('Todo: implement redirect to Print'),
        },
    ];
    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Remove tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
    ];

    return (
        <Box paddingBlockEnd="400">
            <Card>
                <Box paddingBlockEnd="400">
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        autoComplete="off"
                    />
                </Box>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={filteredOrders.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    bulkActions={bulkActions}
                    promotedBulkActions={promotedBulkActions}
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'Order' },
                        { title: 'Date' },
                        { title: 'Customer' },
                        { title: 'Total', alignment: 'end' },
                        { title: 'Payment status' },
                        { title: 'Fulfillment status' },
                    ]}
                    pagination={{
                        hasNext: true,
                        onNext: () => { },
                    }}
                >
                    {rowMarkup}
                </IndexTable>
            </Card>
        </Box>
    );
}