import katex from "katex";
import "katex/dist/katex.min.css";

interface TexProps extends React.HTMLAttributes<HTMLSpanElement> {
  tex: string;
  block?: boolean;
}

const Tex = ({ tex, block = false, ...props }: TexProps) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          displayMode: block,
          throwOnError: false,
        }),
      }}
      {...props}
    />
  );
};

export default Tex;
