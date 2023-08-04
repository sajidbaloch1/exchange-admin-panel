import React, { Fragment, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars";

const Sidebar = () => {
  const location = useLocation(); // Get the current location
  const [mainmenu, setMainMenu] = useState([]);
  const userRole = JSON.parse(localStorage.getItem("user_info")).role;

  useEffect(() => {
    setMainMenu(getMenuItems(userRole));

  }, []);

  const getMenuItems = (userRole) => {

    let menuItems = [
      {
        menutitle: "MAIN",
        Items: [
          {
            path: `${process.env.PUBLIC_URL}/dashboard`,
            icon: "home",
            type: "link",
            active: true,
            title: "Dashboard",
          },
        ],
      },
      {
        menutitle: "ACCOUNT",
        Items: [
          {
            path: `${process.env.PUBLIC_URL}/account-list`,
            icon: "users",
            type: "link",
            active: false,
            title: "Accounts",
          },
        ],
      },

    ];

    if (userRole === "system_owner") {
      menuItems.push(

        {
          menutitle: "CURRENCY",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/currency-list`,
              icon: "dollar-sign",
              type: "link",
              active: false,
              title: "Currencies",
            },
          ],
        },
        {
          menutitle: "SPORTS",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/sport-list`,
              icon: "grid",
              type: "link",
              active: false,
              title: "Sports",
              allRouet: ['sport-form', 'sport-list']
            },
          ],
        },
        {
          menutitle: "COMPETITION",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/competition-list`,
              icon: "globe",
              type: "link",
              active: false,
              title: "Competitions",
              allRouet: ['competition-form', 'competition-list']
            },
          ],
        },
        {
          menutitle: "EVENT",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/event-list`,
              icon: "layers",
              type: "link",
              active: false,
              title: "Events",
              allRouet: ['event-form', 'event-list']
            },
          ],
        }, {
        menutitle: "ADD EVENT",
        Items: [
          {
            path: `${process.env.PUBLIC_URL}/api-event-list`,
            icon: "layers",
            type: "link",
            active: false,
            title: "Add Event",
            allRouet: ['api-event-list']
          },
        ],
      },
      );
    } else if (userRole === "super_admin") {
      menuItems.push(
        {
          menutitle: "MULTILOGIN",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/multi-login`,
              icon: "copy",
              type: "link",
              active: false,
              title: "Multi login",
            },
          ],
        },
        {
          menutitle: "USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "Users",
            },
          ],
        },
        {
          menutitle: "THEME USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/theme-user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "Theme Users",
            },
          ],
        },
        {
          menutitle: "REPORTS",
          Items: [
            {
              title: "Reports",
              icon: "file-text",
              type: "sub",
              active: false,
              children: [
                {
                  path: `${process.env.PUBLIC_URL}/account-statement`,
                  title: "Account statement",
                  type: "link",
                },
              ],
            },
          ],
        },

      );
    } else if (userRole === "admin") {
      menuItems.push(
        {
          menutitle: "USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "User",
            },
          ],
        },

      );
    }
    else if (userRole === "super_master") {
      menuItems.push(
        {
          menutitle: "USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "User",
            },
          ],
        },

      );
    }
    else if (userRole === "master") {
      menuItems.push(
        {
          menutitle: "USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "User",
            },
          ],
        },

      );
    } else if (userRole === "agent") {
      menuItems.push(
        {
          menutitle: "USER",
          Items: [
            {
              path: `${process.env.PUBLIC_URL}/user-list`,
              icon: "user",
              type: "link",
              active: false,
              title: "User",
            },
          ],
        },

      );
    }

    return menuItems;
  };

  useEffect(() => {
    const currentUrl = window.location.pathname.slice(0, -1);
    const currentPath = location.pathname; // Get the current path

    mainmenu.map((items) => {

      items.Items.filter((Items) => {
        if (currentPath.includes(Items.path)) {
          Items.active = true;
        } else {
          Items.active = false;
        }

        if (Items.path === currentUrl) setNavActive(Items);
        if (!Items.children) return false;
        Items.children.filter((subItems) => {
          if (subItems.path === currentUrl) setNavActive(subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path === currentUrl) {
              setNavActive(subSubItems);
              return true;
            } else {
              return false;
            }
          });
          return subItems;
        });
        return Items;
      });
      return items;
    });
  }, []);

  const setNavActive = (item) => {
    mainmenu.map((menuItems) => {
      menuItems.Items.filter((Items) => {
        if (Items !== item) {
          Items.active = false;
        }
        if (Items.children && Items.children.includes(item)) {
          Items.active = true;
        }
        if (Items.children) {
          Items.children.filter((submenuItems) => {
            if (
              submenuItems.children &&
              submenuItems.children.includes(item)
            ) {
              Items.active = true;
              submenuItems.active = true;
              return true;
            } else {
              return false;
            }
          });
        }
        return Items;
      });
      return menuItems;
    });
    item.active = !item.active;
    setMainMenu([...mainmenu]);
  };

  const toggletNavActive = (item) => {
    if (window.innerWidth <= 991) {
      if (item.type === "sub") {
      }
    }
    if (!item.active) {
      mainmenu.map((a) => {
        a.Items.filter((Items) => {
          if (a.Items.includes(item)) Items.active = false;
          if (!Items.children) return false;
          Items.children.forEach((b) => {
            if (Items.children.includes(item)) {
              b.active = false;
            }
            if (!b.children) return false;
            b.children.forEach((c) => {
              if (b.children.includes(item)) {
                c.active = false;
              }
            });
          });
          return Items;
        });
        return a;
      });
    }
    item.active = !item.active;
    setMainMenu([...mainmenu]);
  };

  // Hover effect functions

  return (
    <div className="sticky">
      <div className="app-sidebar__overlay"></div>
      <aside className="app-sidebar">
        <Scrollbars>
          <div className="header side-header">
            <Link to={`${process.env.PUBLIC_URL}/dashboard/`} className="header-brand1">
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="header-brand-img desktop-logo"
                alt="logo"
              />
              <img
                src={require("../../assets/images/brand/logo-1.png")}
                className="header-brand-img toggle-logo"
                alt="logo-1"
              />
              <img
                src={require("../../assets/images/brand/logo-2.png")}
                className="header-brand-img light-logo"
                alt="logo-2"
              />
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="header-brand-img light-logo1"
                alt="logo-3"
              />
            </Link>
          </div>
          <div className="main-sidemenu">
            <div className="slide-left disabled" id="slide-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            <div className="slide-leftRTL disabled" id="slide-leftRTL">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            <ul className="side-menu" id="sidebar-main">
              {mainmenu.map((Item, i) => (
                <Fragment key={i}>
                  <li className="sub-category">
                    <h3>{Item.menutitle}</h3>
                  </li>
                  {Item.Items.map((menuItem, i) => (
                    <li
                      className={`slide ${menuItem.active ? "is-expanded" : ""}`}
                      key={i}
                    >
                      {menuItem.type === "link" ? (
                        <NavLink
                          to={menuItem.path + "/"}
                          className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                          onClick={() => {
                            setNavActive(menuItem);
                            toggletNavActive(menuItem);
                          }}
                        >
                          <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                          <span className="side-menu__label">{menuItem.title}</span>
                          {menuItem.badge ? (
                            <label className={`${menuItem.badge} side-badge`}>
                              {menuItem.badgetxt}
                            </label>
                          ) : (
                            ""
                          )}
                        </NavLink>
                      ) : (
                        ""
                      )}

                      {menuItem.type === "sub" ? (
                        <NavLink
                          to={menuItem.path + "/"}
                          className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                          onClick={(event) => {
                            event.preventDefault();
                            setNavActive(menuItem);
                          }}
                        >
                          <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                          <span className="side-menu__label">{menuItem.title}</span>
                          {menuItem.badge ? (
                            <label className={`${menuItem.badge} side-badge`}>
                              {menuItem.badgetxt}
                            </label>
                          ) : (
                            ""
                          )}
                          <i className={`${menuItem.background} fa angle fa-angle-right `}></i>
                        </NavLink>
                      ) : (
                        ""
                      )}
                      {menuItem.children ? (
                        <ul
                          className="slide-menu"
                          style={
                            menuItem.active
                              ? {
                                opacity: 1,
                                transition: "opacity 500ms ease-in",
                                display: "block",
                              }
                              : { display: "none" }
                          }
                        >
                          {menuItem.children.map((childrenItem, index) => {
                            return (
                              <li key={index}>
                                {childrenItem.type === "sub" ? (
                                  <a
                                    href="javascript"
                                    className="sub-side-menu__item"
                                    onClick={(event) => {
                                      event.preventDefault();
                                      toggletNavActive(childrenItem);
                                    }}
                                  >
                                    <span className="sub-side-menu__label">
                                      {childrenItem.title}
                                    </span>
                                    {childrenItem.active ? (
                                      <i className="sub-angle  fa fa-angle-down"></i>
                                    ) : (
                                      <i className="sub-angle fa fa-angle-right"></i>
                                    )}
                                  </a>
                                ) : (
                                  ""
                                )}
                                {childrenItem.type === "link" ? (
                                  <NavLink
                                    to={childrenItem.path + "/"}
                                    className="slide-item"
                                    onClick={() => toggletNavActive(childrenItem)}
                                  >
                                    {childrenItem.title}
                                  </NavLink>
                                ) : (
                                  ""
                                )}
                                {childrenItem.children ? (
                                  <ul
                                    className="sub-slide-menu"
                                    style={
                                      childrenItem.active
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    {childrenItem.children.map(
                                      (childrenSubItem, key) => (
                                        <li key={key}>
                                          {childrenSubItem.type === "link" ? (
                                            <NavLink
                                              to={childrenSubItem.path + "/"}
                                              className={`${"sub-slide-item"}`}
                                              onClick={() =>
                                                toggletNavActive(childrenSubItem)
                                              }
                                            >
                                              {childrenSubItem.title}
                                            </NavLink>
                                          ) : (
                                            ""
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  ""
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </Fragment>
              ))}
            </ul>
            <div className="slide-right" id="slide-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
            <div className="slide-rightRTL" id="slide-rightRTL">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
          </div>
        </Scrollbars>
      </aside>
    </div>
  );
};

export default Sidebar;