'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
    const router = useRouter();
    const pathname = usePathname();

    // Toggle sidebar open/close
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Toggle section expansion
    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    // Handle navigation
    const handleNavigation = (path) => {
        if (path) {
            router.push(path);
        }
    };

    // Menu structure with nested items
    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: '📊',
            path: '/dashboard',
            subItems: []
        },
        {
            id: 'vouchers',
            title: 'Vouchers',
            icon: '📄',
            path: null,
            subItems: [
                { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
                { id: 'petty-voucher', title: 'Petty Voucher', path: '/vouchers/petty' },
                { id: 'purchase-voucher', title: 'Purchase Voucher', path: '/vouchers/purchase' },
                { id: 'lc-voucher', title: 'LC Voucher', path: '/vouchers/lc' },
                { id: 'sales-voucher', title: 'Sales Voucher', path: '/vouchers/sales' },
                { id: 'transfer-voucher', title: 'Transfer Voucher', path: '/vouchers/transfer' }
            ]
        },
        {
            id: 'inventory',
            title: 'Inventory',
            icon: '📦',
            path: null,
            subItems: [
                { id: 'grn-local', title: 'GRN Local', path: '/inventory/grn' },
                { id: 'grn-import', title: 'GRN Import', path: '/inventory/grn-import' },
                { id: 'gdn', title: 'GDN', path: '/inventory/dispatch' },
                { id: 'duty-calc', title: 'Duty Calculation Import', path: '/inventory/duty-calc' }
            ]
        },
        {
            id: 'orders',
            title: 'Orders',
            icon: '🛒',
            path: null,
            subItems: [
                { id: 'sales-order', title: 'Sales Order', path: '/order/sales' },
                { id: 'purchase-order', title: 'Purchase Order', path: '/order/purchase' }
            ]
        },
        {
            id: 'definition-ac',
            title: 'Definition A/C',
            icon: '⚙️',
            path: null,
            subItems: [
                { id: 'coa', title: 'COA', path: '/coa' },
                { id: 'purchase-order-def', title: 'Purchase Order', path: '/definition-ac/purchase-order' }
            ]
        },
        {
            id: 'definition-inventory',
            title: 'Definition Inventory',
            icon: '🔧',
            path: null,
            subItems: [
                { id: 'items', title: 'Items', path: '/items' },
                { id: 'item-class', title: 'Item Class', path: '/items-class' },
                { id: 'uom', title: 'UOM', path: '/definition-inventory/uom' }
            ]
        },
        {
            id: 'reports',
            title: 'Reports',
            icon: '📈',
            path: null,
            subItems: [
                {
                    id: 'reports-ac',
                    title: 'Reports A/C',
                    path: null,
                    subItems: [
                        { id: 'ledger-by-head', title: 'Ledger by Head', path: '/reports/ac/ledger-head' },
                        { id: 'ledger-forex-1', title: 'Ledger by Forex 1', path: '/reports/ac/ledger-forex-1' },
                        { id: 'ledger-forex-2', title: 'Ledger by Forex 2', path: '/reports/ac/ledger-forex-2' },
                        { id: 'trial-balance-6', title: 'Trial Balance Cal-6', path: '/reports/ac/trial-balance-6' },
                        { id: 'trial-balance-4', title: 'Trial Balance Cal-4', path: '/reports/ac/trial-balance-4' },
                        { id: 'aging-report', title: 'Aging Report', path: '/reports/ac/aging' },
                        { id: 'cash-book', title: 'Cash Book', path: '/reports/ac/cash-book' }
                    ]
                },
                {
                    id: 'voucher-reports',
                    title: 'Voucher Reports',
                    path: null,
                    subItems: [
                        { id: 'journal-voucher-report', title: 'Journal Voucher Report', path: '/reports/voucher/journal' },
                        { id: 'petty-voucher-report', title: 'Petty Voucher Report', path: '/reports/voucher/petty' },
                        { id: 'purchase-voucher-report', title: 'Purchase Voucher Report', path: '/reports/voucher/purchase' },
                        { id: 'lc-voucher-report', title: 'LC Voucher Report', path: '/reports/voucher/lc' },
                        { id: 'sales-voucher-report', title: 'Sales Voucher Report', path: '/reports/voucher/sales' },
                        { id: 'transfer-voucher-report', title: 'Transfer Voucher Report', path: '/reports/voucher/transfer' }
                    ]
                },
                {
                    id: 'inventory-reports',
                    title: 'Inventory Reports',
                    path: null,
                    subItems: [
                        { id: 'stock-position', title: 'Stock Position', path: '/reports/inventory/stock-position' }
                    ]
                },
                {
                    id: 'order-reports',
                    title: 'Order Reports',
                    path: null,
                    subItems: [
                        { id: 'sales-order-report', title: 'Sales Order Report', path: '/reports/order/sales' },
                        { id: 'purchase-order-report', title: 'Purchase Order Report', path: '/reports/order/purchase' }
                    ]
                }
            ]
        }
    ];

    // Recursive component for nested menu items
    const MenuItem = ({ item, level = 0, isVisible = true }) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedSections[item.id];
        const paddingLeft = level * 16;
        const isActive = pathname === item.path;

        const handleClick = () => {
            if (hasSubItems) {
                toggleSection(item.id);
            } else if (item.path) {
                handleNavigation(item.path);
            }
        };

        return (
            <div className="w-full">
                <button
                    onClick={handleClick}
                    className={`
                        w-full flex items-center justify-between
                        px-4 py-2.5 text-left
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-all duration-200 ease-in-out
                        ${level === 0 ? 'font-medium' : 'text-sm'}
                        ${level > 0 ? 'border-l-2 border-gray-200 dark:border-gray-600' : ''}
                        ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}
                        ${!isVisible && level === 0 ? 'justify-center' : ''}
                    `}
                    style={{ paddingLeft: isVisible ? `${16 + paddingLeft}px` : level === 0 ? '16px' : `${16 + paddingLeft}px` }}
                    title={!isVisible && level === 0 ? item.title : ''}
                >
                    <div className="flex items-center gap-3">
                        {level === 0 && item.icon && (
                            <span className={`text-lg ${!isVisible ? 'mx-auto' : ''}`}>{item.icon}</span>
                        )}
                        <span className={`${!isVisible && level === 0 ? 'hidden' : ''} transition-all duration-300`}>
                            {item.title}
                        </span>
                    </div>

                    {hasSubItems && isVisible && (
                        <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                        </span>
                    )}
                </button>

                {/* Animated submenu */}
                {hasSubItems && isVisible && (
                    <div
                        className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                        `}
                    >
                        {item.subItems.map((subItem) => (
                            <MenuItem
                                key={subItem.id}
                                item={subItem}
                                level={level + 1}
                                isVisible={isVisible}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar with hover functionality */}
            <aside
                onMouseEnter={() => !isOpen && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    fixed left-0 top-0 h-full bg-white dark:bg-gray-800
                    shadow-xl z-40 transition-all duration-300 ease-in-out
                    ${(isOpen || isHovered) ? 'w-64' : 'w-16'}
                    overflow-hidden
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 className={`font-bold text-xl dark:text-white ${(!isOpen && !isHovered) ? 'hidden' : ''} transition-all duration-300`}>
                        ERP System
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {isOpen ? <ChevronRight className="w-5 h-5 dark:text-white" /> : <Menu className="w-5 h-5 dark:text-white" />}
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="overflow-y-auto h-[calc(100%-64px)] py-4 dark:text-gray-200">
                    {menuItems.map((item) => (
                        <MenuItem 
                            key={item.id} 
                            item={item} 
                            isVisible={isOpen || isHovered}
                        />
                    ))}
                </nav>

                {/* Footer with user info (optional) */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 ${(!isOpen && !isHovered) ? 'hidden' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            U
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium dark:text-white">User Name</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                />
            )}

            {/* Main content padding adjustment */}
            <style jsx global>{`
                .main-content {
                    margin-left: ${(isOpen || isHovered) ? '256px' : '64px'};
                    transition: margin-left 0.3s ease-in-out;
                }
                
                @media (max-width: 1024px) {
                    .main-content {
                        margin-left: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;
