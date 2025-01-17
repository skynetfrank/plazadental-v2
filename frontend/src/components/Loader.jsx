function Loader(props) {
  return (
    <div className="flx jcenter mtop-3 font-1">
      <div className="loader"></div>
      <span>{props.txt}</span>
    </div>
  );
}

export default Loader;
