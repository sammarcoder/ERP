// 'use client';
// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
// import { useRouter, usePathname } from 'next/navigation';

// const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const [expandedSections, setExpandedSections] = useState({});
//     const router = useRouter();
//     const pathname = usePathname();

//     // Toggle sidebar open/close
//     const toggleSidebar = () => setIsOpen(!isOpen);

//     // Toggle section expansion
//     const toggleSection = (sectionId) => {
//         setExpandedSections(prev => ({
//             ...prev,
//             [sectionId]: !prev[sectionId]
//         }));
//     };

//     // Handle navigation
//     const handleNavigation = (path) => {
//         if (path) {
//             router.push(path);
//         }
//     };

//     // Menu structure with nested items
//     const menuItems = [
//         {
//             id: 'dashboard',
//             title: 'Dashboard',
//             icon: '📊',
//             path: '/dashboard',
//             subItems: []
//         },
//         {
//             id: 'manufacture',
//             title: 'Manufactures',
//             icon: '📄',
//             path: null,
//             subItems: [
//                 { id: 'departments', title: 'Departments', path: '/departments' },
//                 // { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
//                 { id: 'employees', title: 'Employees', path: '/employees' },
//                 { id: 'machines', title: 'Machines', path: '/machines' },
//                 { id: 'shifts', title: 'Shifts', path: '/shifts' },
//                 { id: 'moulds', title: 'Moulds', path: '/moulds' },
//                 { id: 'masterTypes', title: 'Master Types', path: '/master-types' },
//                 { id: 'gin', title: 'GIN', path: '/gin' },
//                 { id: 'mgrn', title: 'MGRN', path: '/mgrn' },
//                 { id: 'recipe', title: 'Recipe', path: '/recipe' }
//             ]
//         },
//         {
//             id: 'lcmanagement',
//             title: 'Lc Management',
//             icon: '📄',
//             path: null,
//             subItems: [
//                 { id: 'lc-voucher', title: 'LC Voucher', path: '/vouchers/lc' },
//                 { id: 'lcMain', title: 'Lc Main', path: '/lc-main' },
//                 { id: 'zlcv', title: 'Z LCV', path: '/vouchers/lcv' },

//             ]
//         },
//         {
//             id: 'vouchers',
//             title: 'Vouchers',
//             icon: '📄',
//             path: null,
//             subItems: [
//                 { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
//                 // { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
//                 { id: 'petty-voucher', title: 'Petty Voucher', path: '/vouchers/petty' },
//                 { id: 'purchase-voucher', title: 'Purchase Voucher', path: '/vouchers/purchase' },
//                 { id: 'sales-voucher', title: 'Sales Voucher', path: '/vouchers/sales' },
//                 { id: 'transfer-voucher', title: 'Transfer Voucher', path: '/vouchers/transfer' },

//             ]
//         },
//         {
//             id: 'inventory',
//             title: 'Inventory',
//             icon: '📦',
//             path: null,
//             subItems: [
//                 // { id: 'grn-local', title: 'GRN Local', path: '/inventory/grn' },
//                 { id: 'grn-import', title: 'GRN Import', path: '/inventory/grn-import' },
//                 // { id: 'gdn', title: 'GDN', path: '/inventory/dispatch' },
//                 { id: 'duty-calc', title: 'Duty Calculation Import', path: '/inventory/duty-calc' },
//                 { id: 'grn', title: 'GRN ', path: '/inventoryy/grn' },
//                 { id: 'gdn', title: 'GDN ', path: '/inventory/gdn' },
//             ]
//         },
//         {
//             id: 'orders',
//             title: 'Orders',
//             icon: '🛒',
//             path: null,
//             subItems: [
//                 // { id: 'sales-order', title: 'Sales Order', path: '/order/sales' },
//                 // { id: 'purchase-order', title: 'Purchase Order', path: '/order/purchase' },
//                 { id: 'sales-order-2', title: 'Sales Order 2', path: '/orders/sales' },
//                 { id: 'purchase-order-2', title: 'Purchase Order 2', path: '/orders/purchase' }
//             ]
//         },
//         {
//             id: 'definition-ac',
//             title: 'Definition A/C',
//             icon: '⚙️',
//             path: null,
//             subItems: [
//                 { id: 'coa', title: 'COA', path: '/coa' },
//                 // { id: 'purchase-order-def', title: 'Purchase Order', path: '/definition-ac/purchase-order' },
//                 { id: 'currency', title: 'Currency', path: '/currency' },
//                 { id: 'control head 2', title: 'control head 2', path: '/control-headTwo' },
//             ]
//         },
//         {
//             id: 'definition-inventory',
//             title: 'Definition Inventory',
//             icon: '🔧',
//             path: null,
//             subItems: [
//                 { id: 'items', title: 'Items', path: '/items' },
//                 { id: 'item-class', title: 'Item Class', path: '/items-class' },
//                 { id: 'uom', title: 'UOM', path: '/uom' },
//                 { id: 'sales-man', title: 'Sales Man', path: '/salesMan' },
//                 { id: 'Transpoter', title: 'Transporter', path: '/transporter' }
//             ]
//         },
//         {
//             id: 'reports',
//             title: 'Reports',
//             icon: '📈',
//             path: null,
//             subItems: [
//                 {
//                     id: 'reports-ac',
//                     title: 'Reports A/C',
//                     path: null,
//                     subItems: [
//                         { id: 'ledger-by-head', title: 'Ledger by Head', path: '/journalmaster' },
//                         { id: 'ledger-forex-1', title: 'Ledger by Forex 1', path: '/reports/ledger-by-forex-1' },
//                         { id: 'ledger-forex-2', title: 'Ledger by Forex 2', path: '/reports/ac/ledger-forex-2' },
//                         { id: 'trial-balance-6', title: 'Trial Balance Cal-6', path: '/reports/journalmaster/trialbalance-6' },
//                         { id: 'trial-balance-4', title: 'Trial Balance Cal-4', path: '/reports/journalmaster/trialbalance-4' },
//                         { id: 'aging-report', title: 'Aging Report', path: '/reports/ac/aging' },
//                         { id: 'cash-book', title: 'Cash Book', path: '/reports/ac/cash-book' }
//                     ]
//                 },
//                 {
//                     id: 'voucher-reports',
//                     title: 'Voucher Reports',
//                     path: null,
//                     subItems: [
//                         { id: 'journal-voucher-report', title: 'Journal Voucher Report', path: '/reports/vouchers/journalvoucher' },
//                         { id: 'petty-voucher-report', title: 'Petty Voucher Report', path: '/reports/voucher/petty' },
//                         { id: 'purchase-voucher-report', title: 'Purchase Voucher Report', path: '/reports/voucher/purchase' },
//                         { id: 'lc-voucher-report', title: 'LC Voucher Report', path: '/reports/voucher/lc' },
//                         { id: 'sales-voucher-report', title: 'Sales Voucher Report', path: '/reports/voucher/sales' },
//                         { id: 'transfer-voucher-report', title: 'Transfer Voucher Report', path: '/reports/voucher/transfer' },

//                     ]
//                 },
//                 {
//                     id: 'inventory-reports',
//                     title: 'Inventory Reports',
//                     path: null,
//                     subItems: [
//                         { id: 'stock-position', title: 'Stock Position', path: '/reports/inventory/stock-position' },
//                         { id: 'stock-report', title: 'stock Report', path: '/reports/stock-report' },
//                         { id: 'items-order', title: 'gdn Report', path: '/reports/item-order-dispatch' }
//                     ]
//                 },
//                 {
//                     id: 'order-reports',
//                     title: 'Order Reports',
//                     path: null,
//                     subItems: [
//                         { id: 'sales-order-report', title: 'Sales Order Report', path: '/reports/order/sales' },
//                         { id: 'purchase-order-report', title: 'Purchase Order Report', path: '/reports/order/purchase' }
//                     ]
//                 }
//             ]
//         }
//     ];

//     // Recursive component for nested menu items
//     const MenuItem = ({ item, level = 0, isVisible = true }) => {
//         const hasSubItems = item.subItems && item.subItems.length > 0;
//         const isExpanded = expandedSections[item.id];
//         const paddingLeft = level * 16;
//         const isActive = pathname === item.path;

//         const handleClick = () => {
//             if (hasSubItems) {
//                 toggleSection(item.id);
//             } else if (item.path) {
//                 handleNavigation(item.path);
//             }
//         };

//         return (
//             <div className="w-full">
//                 <button
//                     onClick={handleClick}
//                     className={`
//                         w-full flex items-center justify-between
//                         px-4 py-2.5 text-left
//                         hover:bg-gray-100 dark:hover:bg-gray-700
//                         transition-all duration-200 ease-in-out
//                         ${level === 0 ? 'font-medium' : 'text-sm'}
//                         ${level > 0 ? 'border-l-2 border-gray-200 dark:border-gray-600' : ''}
//                         ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}
//                         ${!isVisible && level === 0 ? 'justify-center' : ''}
//                     `}
//                     style={{ paddingLeft: isVisible ? `${16 + paddingLeft}px` : level === 0 ? '16px' : `${16 + paddingLeft}px` }}
//                     title={!isVisible && level === 0 ? item.title : ''}
//                 >
//                     <div className="flex items-center gap-3">
//                         {level === 0 && item.icon && (
//                             <span className={`text-lg ${!isVisible ? 'mx-auto' : ''}`}>{item.icon}</span>
//                         )}
//                         <span className={`${!isVisible && level === 0 ? 'hidden' : ''} transition-all duration-300`}>
//                             {item.title}
//                         </span>
//                     </div>

//                     {hasSubItems && isVisible && (
//                         <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
//                             <ChevronDown className="w-4 h-4" />
//                         </span>
//                     )}
//                 </button>

//                 {/* Animated submenu */}
//                 {hasSubItems && isVisible && (
//                     <div
//                         className={`
//                             overflow-hidden transition-all duration-300 ease-in-out
//                             ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
//                         `}
//                     >
//                         {item.subItems.map((subItem) => (
//                             <MenuItem
//                                 key={subItem.id}
//                                 item={subItem}
//                                 level={level + 1}
//                                 isVisible={isVisible}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <>
//             {/* Mobile Toggle Button */}
//             <button
//                 onClick={toggleSidebar}
//                 className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
//             >
//                 {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>

//             {/* Sidebar with hover functionality */}
//             <aside
//                 onMouseEnter={() => !isOpen && setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//                 className={`
//                     fixed left-0 top-0 h-full bg-white dark:bg-gray-800
//                     shadow-xl z-40 transition-all duration-300 ease-in-out
//                     ${(isOpen || isHovered) ? 'w-64' : 'w-16'}
//                     overflow-hidden
//                 `}
//             >
//                 {/* Header */}
//                 <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
//                     <h2 className={`font-bold text-xl dark:text-white ${(!isOpen && !isHovered) ? 'hidden' : ''} transition-all duration-300`}>
//                         ERP System
//                     </h2>
//                     <button
//                         onClick={toggleSidebar}
//                         className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                     >
//                         {isOpen ? <ChevronRight className="w-5 h-5 dark:text-white" /> : <Menu className="w-5 h-5 dark:text-white" />}
//                     </button>
//                 </div>

//                 {/* Menu Items */}
//                 <nav className="overflow-y-auto h-[calc(100%-64px)] py-4 dark:text-gray-200">
//                     {menuItems.map((item) => (
//                         <MenuItem
//                             key={item.id}
//                             item={item}
//                             isVisible={isOpen || isHovered}
//                         />
//                     ))}
//                 </nav>

//                 {/* Footer with user info (optional) */}
//                 <div className={`absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 ${(!isOpen && !isHovered) ? 'hidden' : ''}`}>
//                     <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
//                             U
//                         </div>
//                         <div className="flex-1">
//                             <p className="text-sm font-medium dark:text-white">User Name</p>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
//                         </div>
//                     </div>
//                 </div>
//             </aside>

//             {/* Overlay for mobile */}
//             {isOpen && (
//                 <div
//                     onClick={toggleSidebar}
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//                 />
//             )}

//             {/* Main content padding adjustment */}
//             <style jsx global>{`
//                 .main-content {
//                     margin-left: ${(isOpen || isHovered) ? '256px' : '64px'};
//                     transition: margin-left 0.3s ease-in-out;
//                 }
                
//                 @media (max-width: 1024px) {
//                     .main-content {
//                         margin-left: 0;
//                     }
//                 }
//             `}</style>
//         </>
//     );
// };

// export default Sidebar;

















































// // components/Sidebar.tsx

// 'use client';
// import React, { useState } from 'react';
// import { 
//   ChevronDown, 
//   ChevronRight, 
//   Menu, 
//   X,
//   LayoutDashboard,
//   Factory,
//   Building2,
//   Users,
//   Settings2,
//   Clock,
//   Box,
//   Layers,
//   ClipboardList,
//   PackageCheck,
//   FileText,
//   Receipt,
//   ShoppingCart,
//   Wallet,
//   CreditCard,
//   ArrowLeftRight,
//   Package,
//   FileInput,
//   FileOutput,
//   Calculator,
//   ShoppingBag,
//   Truck,
//   Settings,
//   BookOpen,
//   DollarSign,
//   Sliders,
//   Scale,
//   UserCircle,
//   BarChart3,
//   FileBarChart,
//   PieChart,
//   TrendingUp,
//   FileSpreadsheet,
//   ClipboardCheck,
//   Boxes,
//   LogOut,
//   User,
//   ChefHat
// } from 'lucide-react';
// import { useRouter, usePathname } from 'next/navigation';

// // Icon mapping for menu items
// const iconMap: Record<string, React.ReactNode> = {
//   dashboard: <LayoutDashboard className="w-5 h-5" />,
//   manufacture: <Factory className="w-5 h-5" />,
//   departments: <Building2 className="w-5 h-5" />,
//   employees: <Users className="w-5 h-5" />,
//   machines: <Settings2 className="w-5 h-5" />,
//   shifts: <Clock className="w-5 h-5" />,
//   moulds: <Box className="w-5 h-5" />,
//   masterTypes: <Layers className="w-5 h-5" />,
//   gin: <ClipboardList className="w-5 h-5" />,
//   mgrn: <PackageCheck className="w-5 h-5" />,
//   recipe: <ChefHat className="w-5 h-5" />,
//   lcmanagement: <FileText className="w-5 h-5" />,
//   vouchers: <Receipt className="w-5 h-5" />,
//   'journal-voucher': <BookOpen className="w-5 h-5" />,
//   'petty-voucher': <Wallet className="w-5 h-5" />,
//   'purchase-voucher': <CreditCard className="w-5 h-5" />,
//   'sales-voucher': <DollarSign className="w-5 h-5" />,
//   'transfer-voucher': <ArrowLeftRight className="w-5 h-5" />,
//   inventory: <Package className="w-5 h-5" />,
//   'grn-import': <FileInput className="w-5 h-5" />,
//   grn: <FileInput className="w-5 h-5" />,
//   gdn: <FileOutput className="w-5 h-5" />,
//   'duty-calc': <Calculator className="w-5 h-5" />,
//   orders: <ShoppingCart className="w-5 h-5" />,
//   'sales-order': <ShoppingBag className="w-5 h-5" />,
//   'purchase-order': <Truck className="w-5 h-5" />,
//   'definition-ac': <Settings className="w-5 h-5" />,
//   coa: <BookOpen className="w-5 h-5" />,
//   currency: <DollarSign className="w-5 h-5" />,
//   'definition-inventory': <Sliders className="w-5 h-5" />,
//   items: <Boxes className="w-5 h-5" />,
//   'item-class': <Layers className="w-5 h-5" />,
//   uom: <Scale className="w-5 h-5" />,
//   'sales-man': <UserCircle className="w-5 h-5" />,
//   Transpoter: <Truck className="w-5 h-5" />,
//   reports: <BarChart3 className="w-5 h-5" />,
//   'reports-ac': <FileBarChart className="w-5 h-5" />,
//   'voucher-reports': <FileSpreadsheet className="w-5 h-5" />,
//   'inventory-reports': <ClipboardCheck className="w-5 h-5" />,
//   'order-reports': <PieChart className="w-5 h-5" />,
//   'ledger-by-head': <TrendingUp className="w-5 h-5" />,
// };

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
//   const router = useRouter();
//   const pathname = usePathname();

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const toggleSection = (sectionId: string) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId]
//     }));
//   };

//   const handleNavigation = (path: string) => {
//     if (path) {
//       router.push(path);
//     }
//   };

//   // Menu structure
//   const menuItems = [
//     {
//       id: 'dashboard',
//       title: 'Dashboard',
//       path: '/dashboard',
//       subItems: []
//     },
//     {
//       id: 'manufacture',
//       title: 'Manufacturing',
//       path: null,
//       subItems: [
//         { id: 'departments', title: 'Departments', path: '/departments' },
//         { id: 'employees', title: 'Employees', path: '/employees' },
//         { id: 'machines', title: 'Machines', path: '/machines' },
//         { id: 'shifts', title: 'Shifts', path: '/shifts' },
//         { id: 'moulds', title: 'Moulds', path: '/moulds' },
//         { id: 'masterTypes', title: 'Master Types', path: '/master-types' },
//         { id: 'recipe', title: 'Recipe', path: '/recipe' },
//         { id: 'gin', title: 'GIN', path: '/gin' },
//         { id: 'mgrn', title: 'MGRN', path: '/mgrn' },
//       ]
//     },
//     {
//       id: 'lcmanagement',
//       title: 'LC Management',
//       path: null,
//       subItems: [
//         { id: 'lc-voucher', title: 'LC Voucher', path: '/vouchers/lc' },
//         { id: 'lcMain', title: 'LC Main', path: '/lc-main' },
//         { id: 'zlcv', title: 'Z LCV', path: '/vouchers/lcv' },
//       ]
//     },
//     {
//       id: 'vouchers',
//       title: 'Vouchers',
//       path: null,
//       subItems: [
//         { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
//         { id: 'petty-voucher', title: 'Petty Voucher', path: '/vouchers/petty' },
//         { id: 'purchase-voucher', title: 'Purchase Voucher', path: '/vouchers/purchase' },
//         { id: 'sales-voucher', title: 'Sales Voucher', path: '/vouchers/sales' },
//         { id: 'transfer-voucher', title: 'Transfer Voucher', path: '/vouchers/transfer' },
//       ]
//     },
//     {
//       id: 'inventory',
//       title: 'Inventory',
//       path: null,
//       subItems: [
//         { id: 'grn-import', title: 'GRN Import', path: '/inventory/grn-import' },
//         { id: 'duty-calc', title: 'Duty Calculation', path: '/inventory/duty-calc' },
//         { id: 'grn', title: 'GRN', path: '/inventoryy/grn' },
//         { id: 'gdn', title: 'GDN', path: '/inventory/gdn' },
//       ]
//     },
//     {
//       id: 'orders',
//       title: 'Orders',
//       path: null,
//       subItems: [
//         { id: 'sales-order-2', title: 'Sales Order', path: '/orders/sales' },
//         { id: 'purchase-order-2', title: 'Purchase Order', path: '/orders/purchase' }
//       ]
//     },
//     {
//       id: 'definition-ac',
//       title: 'Definition A/C',
//       path: null,
//       subItems: [
//         { id: 'coa', title: 'COA', path: '/coa' },
//         { id: 'currency', title: 'Currency', path: '/currency' },
//         { id: 'control-head-2', title: 'Control Head', path: '/control-headTwo' },
//       ]
//     },
//     {
//       id: 'definition-inventory',
//       title: 'Definition Inventory',
//       path: null,
//       subItems: [
//         { id: 'items', title: 'Items', path: '/items' },
//         { id: 'item-class', title: 'Item Class', path: '/items-class' },
//         { id: 'uom', title: 'UOM', path: '/uom' },
//         { id: 'sales-man', title: 'Sales Man', path: '/salesMan' },
//         { id: 'Transpoter', title: 'Transporter', path: '/transporter' }
//       ]
//     },
//     {
//       id: 'reports',
//       title: 'Reports',
//       path: null,
//       subItems: [
//         {
//           id: 'reports-ac',
//           title: 'Reports A/C',
//           path: null,
//           subItems: [
//             { id: 'ledger-by-head', title: 'Ledger by Head', path: '/journalmaster' },
//             { id: 'ledger-forex-1', title: 'Ledger Forex 1', path: '/reports/ledger-by-forex-1' },
//             { id: 'ledger-forex-2', title: 'Ledger Forex 2', path: '/reports/ac/ledger-forex-2' },
//             { id: 'trial-balance-6', title: 'Trial Balance Cal-6', path: '/reports/journalmaster/trialbalance-6' },
//             { id: 'trial-balance-4', title: 'Trial Balance Cal-4', path: '/reports/journalmaster/trialbalance-4' },
//             { id: 'aging-report', title: 'Aging Report', path: '/reports/ac/aging' },
//             { id: 'cash-book', title: 'Cash Book', path: '/reports/ac/cash-book' }
//           ]
//         },
//         {
//           id: 'voucher-reports',
//           title: 'Voucher Reports',
//           path: null,
//           subItems: [
//             { id: 'journal-voucher-report', title: 'Journal Voucher', path: '/reports/vouchers/journalvoucher' },
//             { id: 'petty-voucher-report', title: 'Petty Voucher', path: '/reports/voucher/petty' },
//             { id: 'purchase-voucher-report', title: 'Purchase Voucher', path: '/reports/voucher/purchase' },
//             { id: 'lc-voucher-report', title: 'LC Voucher', path: '/reports/voucher/lc' },
//             { id: 'sales-voucher-report', title: 'Sales Voucher', path: '/reports/voucher/sales' },
//             { id: 'transfer-voucher-report', title: 'Transfer Voucher', path: '/reports/voucher/transfer' },
//           ]
//         },
//         {
//           id: 'inventory-reports',
//           title: 'Inventory Reports',
//           path: null,
//           subItems: [
//             { id: 'stock-position', title: 'Stock Position', path: '/reports/inventory/stock-position' },
//             { id: 'stock-report', title: 'Stock Report', path: '/reports/stock-report' },
//             { id: 'items-order', title: 'GDN Report', path: '/reports/item-order-dispatch' }
//           ]
//         },
//         {
//           id: 'order-reports',
//           title: 'Order Reports',
//           path: null,
//           subItems: [
//             { id: 'sales-order-report', title: 'Sales Order', path: '/reports/order/sales' },
//             { id: 'purchase-order-report', title: 'Purchase Order', path: '/reports/order/purchase' }
//           ]
//         }
//       ]
//     }
//   ];

//   // Get icon for menu item
//   const getIcon = (id: string) => {
//     return iconMap[id] || <Box className="w-5 h-5" />;
//   };

//   // Recursive MenuItem component
//   const MenuItem = ({ item, level = 0, isVisible = true }: { item: any; level?: number; isVisible?: boolean }) => {
//     const hasSubItems = item.subItems && item.subItems.length > 0;
//     const isExpanded = expandedSections[item.id];
//     const isActive = pathname === item.path;
//     const paddingLeft = level * 12;

//     const handleClick = () => {
//       if (hasSubItems) {
//         toggleSection(item.id);
//       } else if (item.path) {
//         handleNavigation(item.path);
//       }
//     };

//     return (
//       <div className="w-full">
//         <button
//           onClick={handleClick}
//           className={`
//             w-full flex items-center justify-between
//             px-3 py-2.5 text-left
//             transition-all duration-200 ease-in-out
//             group relative
//             ${level === 0 ? 'font-medium' : 'text-sm'}
//             ${isActive 
//               ? 'bg-[#4d98de] text-white' 
//               : 'text-gray-600 hover:bg-[#4d98de]/10 hover:text-[#4d98de]'
//             }
//             ${level > 0 ? 'ml-2 border-l-2 border-gray-200 hover:border-[#4d98de]' : ''}
//             ${isActive && level > 0 ? 'border-l-2 border-[#4d98de]' : ''}
//           `}
//           style={{ paddingLeft: isVisible ? `${12 + paddingLeft}px` : level === 0 ? '12px' : `${12 + paddingLeft}px` }}
//           title={!isVisible && level === 0 ? item.title : ''}
//         >
//           <div className="flex items-center gap-3">
//             {level === 0 && (
//               <span className={`flex-shrink-0 transition-colors duration-200 ${
//                 isActive ? 'text-white' : 'text-[#4d98de] group-hover:text-[#4d98de]'
//               }`}>
//                 {getIcon(item.id)}
//               </span>
//             )}
//             {level > 0 && (
//               <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
//                 isActive ? 'bg-white' : 'bg-gray-400 group-hover:bg-[#4d98de]'
//               }`} />
//             )}
//             <span className={`${!isVisible && level === 0 ? 'hidden' : ''} transition-all duration-300 truncate`}>
//               {item.title}
//             </span>
//           </div>

//           {hasSubItems && isVisible && (
//             <span className={`transform transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
//               <ChevronDown className="w-4 h-4" />
//             </span>
//           )}
//         </button>

//         {/* Submenu */}
//         {hasSubItems && isVisible && (
//           <div
//             className={`
//               overflow-hidden transition-all duration-300 ease-in-out
//               ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
//             `}
//           >
//             {item.subItems.map((subItem: any) => (
//               <MenuItem
//                 key={subItem.id}
//                 item={subItem}
//                 level={level + 1}
//                 isVisible={isVisible}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const isExpanded = isOpen || isHovered;

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg lg:hidden border border-gray-200 hover:bg-gray-50 transition-colors"
//       >
//         {isOpen ? (
//           <X className="w-5 h-5 text-[#4d98de]" />
//         ) : (
//           <Menu className="w-5 h-5 text-[#4d98de]" />
//         )}
//       </button>

//       {/* Sidebar */}
//       <aside
//         onMouseEnter={() => !isOpen && setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className={`
//           fixed left-0 top-0 h-full bg-white
//           shadow-xl z-40 transition-all duration-300 ease-in-out
//           ${isExpanded ? 'w-64' : 'w-16'}
//           overflow-hidden border-r border-gray-100
//           flex flex-col
//         `}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#4d98de] to-[#3a7fc4]">
//           <div className={`flex items-center gap-3 ${!isExpanded ? 'hidden' : ''}`}>
//             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
//               <Factory className="w-5 h-5 text-[#4d98de]" />
//             </div>
//             <h2 className="font-bold text-lg text-white tracking-tight">
//               ERP System
//             </h2>
//           </div>
          
//           {/* Collapsed Logo */}
//           {!isExpanded && (
//             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mx-auto">
//               <Factory className="w-5 h-5 text-[#4d98de]" />
//             </div>
//           )}

//           {/* Toggle Button */}
//           {isExpanded && (
//             <button
//               onClick={toggleSidebar}
//               className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
//             >
//               <ChevronRight className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
//             </button>
//           )}
//         </div>

//         {/* Search (only when expanded) */}
//         {/* {isExpanded && (
//           <div className="px-3 py-3 border-b border-gray-100">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search menu..."
//                 className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d98de]/30 focus:border-[#4d98de] transition-all"
//               />
//               <svg
//                 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </div>
//           </div>
//         )} */}

//         {/* Menu Items */}
//         <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
//           {menuItems.map((item) => (
//             <MenuItem
//               key={item.id}
//               item={item}
//               isVisible={isExpanded}
//             />
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className={`border-t border-gray-100 bg-gray-50 ${!isExpanded ? 'py-3' : 'p-3'}`}>
//           {isExpanded ? (
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 bg-gradient-to-br from-[#4d98de] to-[#3a7fc4] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
//                   <User className="w-5 h-5" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
//                   <p className="text-xs text-gray-500 truncate">admin@erp.com</p>
//                 </div>
//               </div>
//               <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors group" title="Logout">
//                 <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
//               </button>
//             </div>
//           ) : (
//             <div className="flex justify-center">
//               <div className="w-9 h-9 bg-gradient-to-br from-[#4d98de] to-[#3a7fc4] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
//                 <User className="w-5 h-5" />
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           onClick={toggleSidebar}
//           className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
//         />
//       )}

//       {/* Main Content Padding */}
//       <style jsx global>{`
//         .main-content {
//           margin-left: ${isExpanded ? '256px' : '64px'};
//           transition: margin-left 0.3s ease-in-out;
//         }
        
//         @media (max-width: 1024px) {
//           .main-content {
//             margin-left: 0;
//           }
//         }

//         /* Custom scrollbar */
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: transparent;
//         }
        
//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: #e5e7eb;
//           border-radius: 2px;
//         }
        
//         .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//           background: #d1d5db;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;




























































// components/Sidebar.tsx

'use client';
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X,
  LayoutDashboard,
  Factory,
  Building2,
  Users,
  Settings2,
  Clock,
  Box,
  Layers,
  ClipboardList,
  PackageCheck,
  FileText,
  Receipt,
  ShoppingCart,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Package,
  FileInput,
  FileOutput,
  Calculator,
  ShoppingBag,
  Truck,
  Settings,
  BookOpen,
  DollarSign,
  Sliders,
  Scale,
  UserCircle,
  BarChart3,
  FileBarChart,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  ClipboardCheck,
  Boxes,
  LogOut,
  User,
  ChefHat,
  Landmark,
  Search
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

// Types
interface SubItem {
  id: string;
  title: string;
  path: string | null;
  subItems?: SubItem[];
}

interface MenuItem {
  id: string;
  title: string;
  path: string | null;
  subItems: SubItem[];
}

type TabType = 'manufacturing' | 'accounting';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-5 h-5" />,
  departments: <Building2 className="w-5 h-5" />,
  employees: <Users className="w-5 h-5" />,
  machines: <Settings2 className="w-5 h-5" />,
  shifts: <Clock className="w-5 h-5" />,
  moulds: <Box className="w-5 h-5" />,
  masterTypes: <Layers className="w-5 h-5" />,
  recipe: <ChefHat className="w-5 h-5" />,
  gin: <ClipboardList className="w-5 h-5" />,
  mgrn: <PackageCheck className="w-5 h-5" />,
  lcmanagement: <FileText className="w-5 h-5" />,
  vouchers: <Receipt className="w-5 h-5" />,
  'journal-voucher': <BookOpen className="w-5 h-5" />,
  'petty-voucher': <Wallet className="w-5 h-5" />,
  'purchase-voucher': <CreditCard className="w-5 h-5" />,
  'sales-voucher': <DollarSign className="w-5 h-5" />,
  'transfer-voucher': <ArrowLeftRight className="w-5 h-5" />,
  inventory: <Package className="w-5 h-5" />,
  'grn-import': <FileInput className="w-5 h-5" />,
  grn: <FileInput className="w-5 h-5" />,
  gdn: <FileOutput className="w-5 h-5" />,
  'duty-calc': <Calculator className="w-5 h-5" />,
  orders: <ShoppingCart className="w-5 h-5" />,
  'sales-order': <ShoppingBag className="w-5 h-5" />,
  'purchase-order': <Truck className="w-5 h-5" />,
  'definition-ac': <Settings className="w-5 h-5" />,
  coa: <BookOpen className="w-5 h-5" />,
  currency: <DollarSign className="w-5 h-5" />,
  'definition-inventory': <Sliders className="w-5 h-5" />,
  items: <Boxes className="w-5 h-5" />,
  'item-class': <Layers className="w-5 h-5" />,
  uom: <Scale className="w-5 h-5" />,
  'sales-man': <UserCircle className="w-5 h-5" />,
  transporter: <Truck className="w-5 h-5" />,
  reports: <BarChart3 className="w-5 h-5" />,
  'reports-ac': <FileBarChart className="w-5 h-5" />,
  'voucher-reports': <FileSpreadsheet className="w-5 h-5" />,
  'inventory-reports': <ClipboardCheck className="w-5 h-5" />,
  'order-reports': <PieChart className="w-5 h-5" />,
  'ledger-by-head': <TrendingUp className="w-5 h-5" />,
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('manufacturing');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  // =============================================
  // MANUFACTURING MENU
  // =============================================
  const manufacturingMenu: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      subItems: []
    },
    {
      id: 'departments',
      title: 'Departments',
      path: '/departments',
      subItems: []
    },
    {
      id: 'employees',
      title: 'Employees',
      path: '/employees',
      subItems: []
    },
    {
      id: 'machines',
      title: 'Machines',
      path: '/machines',
      subItems: []
    },
    {
      id: 'shifts',
      title: 'Shifts',
      path: '/shifts',
      subItems: []
    },
    {
      id: 'moulds',
      title: 'Moulds',
      path: '/moulds',
      subItems: []
    },
    {
      id: 'masterTypes',
      title: 'Master Types',
      path: '/master-types',
      subItems: []
    },
    {
      id: 'recipe',
      title: 'Recipe',
      path: '/recipe',
      subItems: []
    },
    {
      id: 'gin',
      title: 'GIN',
      path: '/gin',
      subItems: []
    },
    {
      id: 'mgrn',
      title: 'MGRN',
      path: '/mgrn',
      subItems: []
    }
  ];

  // =============================================
  // ACCOUNTING MENU
  // =============================================
  const accountingMenu: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      subItems: []
    },
    {
      id: 'lcmanagement',
      title: 'LC Management',
      path: null,
      subItems: [
        { id: 'lc-voucher', title: 'LC Voucher', path: '/vouchers/lc' },
        { id: 'lcMain', title: 'LC Main', path: '/lc-main' },
        { id: 'zlcv', title: 'Z LCV', path: '/vouchers/lcv' },
      ]
    },
    {
      id: 'vouchers',
      title: 'Vouchers',
      path: null,
      subItems: [
        { id: 'journal-voucher', title: 'Journal Voucher', path: '/vouchers/journal' },
        { id: 'petty-voucher', title: 'Petty Voucher', path: '/vouchers/petty' },
        { id: 'purchase-voucher', title: 'Purchase Voucher', path: '/vouchers/purchase' },
        { id: 'sales-voucher', title: 'Sales Voucher', path: '/vouchers/sales' },
        { id: 'transfer-voucher', title: 'Transfer Voucher', path: '/vouchers/transfer' },
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory',
      path: null,
      subItems: [
        { id: 'grn-import', title: 'GRN Import', path: '/inventory/grn-import' },
        { id: 'duty-calc', title: 'Duty Calculation', path: '/inventory/duty-calc' },
        { id: 'grn', title: 'GRN', path: '/inventory/grn' },
        { id: 'gdn', title: 'GDN', path: '/inventory/gdn' },
      ]
    },
    {
      id: 'orders',
      title: 'Orders',
      path: null,
      subItems: [
        { id: 'sales-order', title: 'Sales Order', path: '/orders/sales' },
        { id: 'purchase-order', title: 'Purchase Order', path: '/orders/purchase' }
      ]
    },
    {
      id: 'definition-ac',
      title: 'Definition A/C',
      path: null,
      subItems: [
        { id: 'coa', title: 'COA', path: '/coa' },
        { id: 'currency', title: 'Currency', path: '/currency' },
        { id: 'control-head', title: 'Control Head', path: '/control-headTwo' },
      ]
    },
    {
      id: 'definition-inventory',
      title: 'Definition Inventory',
      path: null,
      subItems: [
        { id: 'items', title: 'Items', path: '/items' },
        { id: 'item-class', title: 'Item Class', path: '/items-class' },
        { id: 'uom', title: 'UOM', path: '/uom' },
        { id: 'sales-man', title: 'Sales Man', path: '/salesMan' },
        { id: 'transporter', title: 'Transporter', path: '/transporter' }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      path: null,
      subItems: [
        {
          id: 'reports-ac',
          title: 'Reports A/C',
          path: null,
          subItems: [
            { id: 'ledger-by-head', title: 'Ledger by Head', path: '/journalmaster' },
            { id: 'ledger-forex-1', title: 'Ledger Forex 1', path: '/reports/ledger-by-forex-1' },
            { id: 'ledger-forex-2', title: 'Ledger Forex 2', path: '/reports/ac/ledger-forex-2' },
            { id: 'trial-balance-6', title: 'Trial Balance Cal-6', path: '/reports/journalmaster/trialbalance-6' },
            { id: 'trial-balance-4', title: 'Trial Balance Cal-4', path: '/reports/journalmaster/trialbalance-4' },
            { id: 'aging-report', title: 'Aging Report', path: '/reports/ac/aging' },
            { id: 'cash-book', title: 'Cash Book', path: '/reports/ac/cash-book' }
          ]
        },
        {
          id: 'voucher-reports',
          title: 'Voucher Reports',
          path: null,
          subItems: [
            { id: 'journal-voucher-report', title: 'Journal Voucher', path: '/reports/vouchers/journalvoucher' },
            { id: 'petty-voucher-report', title: 'Petty Voucher', path: '/reports/voucher/petty' },
            { id: 'purchase-voucher-report', title: 'Purchase Voucher', path: '/reports/voucher/purchase' },
            { id: 'lc-voucher-report', title: 'LC Voucher', path: '/reports/voucher/lc' },
            { id: 'sales-voucher-report', title: 'Sales Voucher', path: '/reports/voucher/sales' },
            { id: 'transfer-voucher-report', title: 'Transfer Voucher', path: '/reports/voucher/transfer' },
          ]
        },
        {
          id: 'inventory-reports',
          title: 'Inventory Reports',
          path: null,
          subItems: [
            { id: 'stock-position', title: 'Stock Position', path: '/reports/inventory/stock-position' },
            { id: 'stock-report', title: 'Stock Report', path: '/reports/stock-report' },
            { id: 'items-order', title: 'GDN Report', path: '/reports/item-order-dispatch' }
          ]
        },
        {
          id: 'order-reports',
          title: 'Order Reports',
          path: null,
          subItems: [
            { id: 'sales-order-report', title: 'Sales Order', path: '/reports/order/sales' },
            { id: 'purchase-order-report', title: 'Purchase Order', path: '/reports/order/purchase' }
          ]
        }
      ]
    }
  ];

  // Get current menu based on active tab
  const currentMenu = activeTab === 'manufacturing' ? manufacturingMenu : accountingMenu;

  // Get icon for menu item
  const getIcon = (id: string): React.ReactNode => {
    return iconMap[id] || <Box className="w-5 h-5" />;
  };

  // Recursive MenuItem component
  const MenuItemComponent = ({ 
    item, 
    level = 0, 
    isVisible = true 
  }: { 
    item: MenuItem | SubItem; 
    level?: number; 
    isVisible?: boolean;
  }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedSections[item.id];
    const isActive = pathname === item.path;
    const paddingLeft = level * 12;

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
            px-3 py-2.5 text-left
            transition-all duration-200 ease-in-out
            group relative
            ${level === 0 ? 'font-medium' : 'text-sm'}
            ${isActive 
              ? 'bg-[#4d98de]/25 text-[#4d98de]' 
              : 'text-gray-600 hover:bg-[#4d98de]/10 hover:text-[#4d98de]'
            }
            ${level > 0 ? 'ml-2 border-l-2 border-gray-200 hover:border-[#4d98de]' : ''}
            ${isActive && level > 0 ? 'border-l-2 border-[#4d98de]' : ''}
          `}
          style={{ paddingLeft: isVisible ? `${12 + paddingLeft}px` : level === 0 ? '12px' : `${12 + paddingLeft}px` }}
          title={!isVisible && level === 0 ? item.title : ''}
        >
          <div className="flex items-center gap-3">
            {level === 0 && (
              <span className={`flex-shrink-0 transition-colors duration-200 ${
                isActive ? 'text-[#4d98de]' : 'text-[#4d98de] group-hover:text-[#4d98de]'
              }`}>
                {getIcon(item.id)}
              </span>
            )}
            {level > 0 && (
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                isActive ? 'bg-white' : 'bg-gray-400 group-hover:bg-[#4d98de]'
              }`} />
            )}
            <span className={`${!isVisible && level === 0 ? 'hidden' : ''} transition-all duration-300 truncate`}>
              {item.title}
            </span>
          </div>

          {hasSubItems && isVisible && (
            <span className={`transform transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </span>
          )}
        </button>

        {/* Submenu */}
        {hasSubItems && isVisible && (
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            {item.subItems?.map((subItem) => (
              <MenuItemComponent
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

  const isExpanded = isOpen || isHovered;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg lg:hidden border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#4d98de]" />
        ) : (
          <Menu className="w-5 h-5 text-[#4d98de]" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => !isOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-0 top-0 h-full bg-white
          shadow-xl z-40 transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-16'}
          overflow-hidden border-r border-gray-100
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#4d98de] to-[#3a7fc4]">
          <div className={`flex items-center gap-3 ${!isExpanded ? 'hidden' : ''}`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Factory className="w-5 h-5 text-[#4d98de]" />
            </div>
            <h2 className="font-bold text-lg text-white tracking-tight">
              ERP System
            </h2>
          </div>
          
          {/* Collapsed Logo */}
          {!isExpanded && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mx-auto">
              <Factory className="w-5 h-5 text-[#4d98de]" />
            </div>
          )}

          {/* Toggle Button */}
          {isExpanded && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* =============================================
            TAB SELECTOR - Manufacturing / Accounting
            ============================================= */}
        {isExpanded && (
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="flex rounded-lg bg-gray-200 p-1">
              {/* Manufacturing Tab */}
              <button
                onClick={() => setActiveTab('manufacturing')}
                className={`
                  flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-sm font-medium
                  transition-all duration-200
                  ${activeTab === 'manufacturing'
                    ? 'bg-white text-[#4d98de] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                {/* <Factory className="w-4 h-4" /> */}
                <span>Manufacturing</span>
              </button>

              {/* Accounting Tab */}
              <button
                onClick={() => setActiveTab('accounting')}
                className={`
                  flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-sm font-medium
                  transition-all duration-200
                  ${activeTab === 'accounting'
                    ? 'bg-white text-[#4d98de] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                {/* <Landmark className="w-4 h-4" /> */}
                <span>Accounting</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Tab Icons */}
        {!isExpanded && (
          <div className="py-2 border-b border-gray-100  mr-4">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setActiveTab('manufacturing')}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${activeTab === 'manufacturing'
                    ? 'bg-[#4d98de] text-white'
                    : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
                title="Manufacturing"
              >
                <Factory className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('accounting')}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${activeTab === 'accounting'
                    ? 'bg-[#4d98de] text-white'
                    : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
                title="Accounting"
              >
                <Landmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Search (only when expanded) */}
        {/* {isExpanded && (
          <div className="px-3 py-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d98de]/30 focus:border-[#4d98de] transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )} */}

        {/* Tab Title */}
        {isExpanded && (
          <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {activeTab === 'manufacturing' ? (
                <>
                  <Factory className="w-4 h-4 text-[#4d98de]" />
                  <span className="text-sm font-semibold text-gray-700">Manufacturing</span>
                </>
              ) : (
                <>
                  <Landmark className="w-4 h-4 text-[#4d98de]" />
                  <span className="text-sm font-semibold text-gray-700">Accounting</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {currentMenu.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              isVisible={isExpanded}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={`border-t border-gray-100 bg-gray-50 ${!isExpanded ? 'py-3' : 'p-3'}`}>
          {isExpanded ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#4d98de] to-[#3a7fc4] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@erp.com</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors group" title="Logout">
                <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-[#4d98de] to-[#3a7fc4] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                <User className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Padding */}
      <style jsx global>{`
        .main-content {
          margin-left: ${isExpanded ? '256px' : '64px'};
          transition: margin-left 0.3s ease-in-out;
        }
        
        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
