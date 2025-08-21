/**
 * Shadow configuration for Material Kit 2 React theme
 */

const createShadow = (r, g, b) => {
  return [
    `0 0 1px 0 rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 1px 1px 0 rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 2px 1px -1px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 1px 3px 0 rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 1px 5px 0 rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 3px 5px -1px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 3px 5px -1px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 4px 5px -2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 5px 5px -3px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 6px 10px 0 rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 7px 10px 1px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 8px 10px 1px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 9px 12px 1px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 10px 14px 2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 11px 15px 1px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 12px 17px 2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 13px 19px 2px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 14px 21px 2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 15px 22px 2px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 16px 24px 2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 17px 26px 2px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 18px 28px 2px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 19px 29px 2px rgba(${r}, ${g}, ${b}, 0.12)`,
    `0 20px 31px 3px rgba(${r}, ${g}, ${b}, 0.14)`,
    `0 21px 33px 3px rgba(${r}, ${g}, ${b}, 0.12)`,
  ];
};

const shadows = createShadow(0, 0, 0);

export default shadows;