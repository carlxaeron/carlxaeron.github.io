export default function Img(props = {}) {
  // console.log(props);
  return <img src={props['data-src']} alt="" />;
}