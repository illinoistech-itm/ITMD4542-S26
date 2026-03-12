import { useParams } from "react-router";

function Topic() {
  const params = useParams();

  return (
    <>
      <h4>Here is some info about {params.topic}</h4>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum
        vel libero in tempor. Fusce tempus mi at ullamcorper ultrices. Aliquam
        vulputate enim et interdum ullamcorper. Donec vel nibh bibendum, laoreet
        urna sit amet, hendrerit ipsum. Donec vitae mauris non est faucibus
        lobortis vel in orci. Sed dictum justo et ipsum pretium mattis.
        Pellentesque vestibulum vel nisl a sagittis. Aliquam commodo volutpat
        diam. Suspendisse cursus magna non malesuada ultricies. Sed egestas et
        ante a rhoncus. Suspendisse eleifend in mauris non pharetra. Quisque
        vitae lacus lectus. Ut elementum risus felis, varius facilisis erat
        cursus in. Sed et bibendum orci, sit amet suscipit est. Suspendisse
        velit ligula, sagittis ac mi sit amet, eleifend scelerisque odio.
      </p>
    </>
  );
}

export default Topic;
