function Loader(props) {
  console.log("props", props);
  return (
    <div className="flx mtop-3 font-1">
      <div className="loader"></div>
      <span>{props.txt}</span>
    </div>
  );
}

export default Loader;
