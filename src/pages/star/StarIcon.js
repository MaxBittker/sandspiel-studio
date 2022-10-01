function StarIcon({ ...rest }) {
  return (
    <svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="StarIcon"
      {...rest}
    >
      <path d="M16 2l3.95 8.563 9.365 1.11-6.924 6.404 1.838 9.25L16 22.72l-8.229 4.606 1.838-9.25-6.924-6.402 9.365-1.11L16 2z" />
    </svg>
  );
}

export default StarIcon;
