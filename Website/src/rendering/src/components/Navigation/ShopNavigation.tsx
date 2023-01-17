import Link from 'next/link';
import React, { useRef, useState } from 'react';
import useOcCurrentCart from '../../hooks/useOcCurrentCart';
import useOcUser from '../../hooks/useOcUser';
import useOcAuth from '../../hooks/useOcAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import MiniCart from '../Checkout/MiniCart';
import CartBadge from '../ShopCommon/CartBadge';
import DiscoverWidget from '../ShopCommon/DiscoverWidget';
import PreviewSearch, { PreviewSearchProps } from '../PreviewSearch/PreviewSearch';
import { isAuthenticationEnabled } from '../../services/AuthenticationService';
import ClickOutside from '../ShopCommon/ClickOutside';
import AccountPopup from './AccountPopup';
import { dispatchDiscoverCartStatusListActionEvent } from '../../helpers/discover/CartStatusDispatcher';

export type ShopNavigationProps = {
  previewSearchProps?: PreviewSearchProps; // For Storybook support
};

const ShopNavigation = (props: ShopNavigationProps): JSX.Element => {
  const { user } = useOcUser();
  const { isAnonymous, isAuthenticated } = useOcAuth();
  const isUserLoggedIn = !isAnonymous && isAuthenticated;

  const { lineItems } = useOcCurrentCart();

  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const miniCartRef = useRef(null);
  const closeMinicart = () => setIsMiniCartOpen(false);
  ClickOutside([miniCartRef], closeMinicart);

  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);
  const accountPopupRef = useRef(null);
  const closeAccountPopup = () => setIsAccountPopupOpen(false);
  ClickOutside([accountPopupRef], closeAccountPopup);

  const anomymousAvatar = !isUserLoggedIn && <FontAwesomeIcon id="user-icon" icon={faUserCircle} />;

  let userInitials = '';
  if (isUserLoggedIn) {
    userInitials = user?.FirstName.substring(0, 1) + user?.LastName.substring(0, 1);
  }

  const loggedInAvatar = isUserLoggedIn && (
    <>
      <span className="user-avatar">{userInitials}</span>
    </>
  );

  const accountPopupActiveClass = isAccountPopupOpen ? 'active' : '';
  const accountPopupOpenClass = isAccountPopupOpen ? 'open' : '';
  const accountMenuItem = isAuthenticationEnabled && (
    <li className={`shop-navigation-menu-item ${accountPopupActiveClass}`} ref={accountPopupRef}>
      <button onClick={() => setIsAccountPopupOpen(!isAccountPopupOpen)}>
        {anomymousAvatar}
        {loggedInAvatar}
      </button>
      <div className={`account-popup-wrapper ${accountPopupOpenClass}`}>
        <AccountPopup onNavigatingAway={closeAccountPopup} />
      </div>
    </li>
  );

  const handleCartIconClick = () => {
    if (!isMiniCartOpen && lineItems?.length !== undefined) {
      dispatchDiscoverCartStatusListActionEvent(lineItems);
    }
    setIsMiniCartOpen(!isMiniCartOpen);
  };

  const previewSearchWidget = props.previewSearchProps ? (
    <PreviewSearch {...props.previewSearchProps} />
  ) : (
    <DiscoverWidget rfkId="rfkid_6" />
  );

  const miniCartActiveClass = isMiniCartOpen ? 'active' : '';
  const miniCartOpenClass = isMiniCartOpen ? 'open' : '';

  return (
    <nav className="shop-navigation">
      <div className="shop-container shop-navigation-content">
        <div className="logo-container">
          <Link href="/shop">
            <a className="logo-link">
              <img src="/assets/img/shop/oc-demo-logo.svg" alt="OrderCloud Demo" />
            </a>
          </Link>
        </div>
        <div className="items-container">
          <ul>
            <li
              className={`shop-navigation-menu-item cart-menu-item ${miniCartActiveClass}`}
              ref={miniCartRef}
            >
              <button onClick={handleCartIconClick}>
                <FontAwesomeIcon id="cart-icon" icon={faShoppingCart} />
                <CartBadge />
              </button>
              <div className={`mini-cart-wrapper ${miniCartOpenClass}`}>
                <MiniCart onNavigatingAway={closeMinicart} />
              </div>
            </li>
            {accountMenuItem}
          </ul>
        </div>
        <div className="shop-search-input-container">
          <div id="search-input-container">{previewSearchWidget}</div>
        </div>
      </div>
    </nav>
  );
};

export default ShopNavigation;
