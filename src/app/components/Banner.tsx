export default function Banner() {
  return (
    <div className="banner-div">
      <h1 className="text-2xl sm:text-5xl playwrite-hu font-bold text-center my-10 bg-green-300 rounded w-9/12 mx-auto py-6">
        PHARM NCD PATIENT LIST
      </h1>
      <img
        src="/images/pharm-banner.jpg"
        alt="Pharm Banner"
        className="banner-img mx-auto"
      />
    </div>
  );
}
