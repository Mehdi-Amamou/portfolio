import Image from "next/image";

type ProjectShotProps = {
  src?: string;
  alt: string;
  label: string;
  sizes: string;
};

// Emplacement « [capture à fournir] » tant que le fichier n'existe pas dans public/projets/<id>/.
export function ProjectShot({ src, alt, label, sizes }: ProjectShotProps) {
  return (
    <div className="mh-shot">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} />
      ) : (
        <span className="mh-ph">{label}</span>
      )}
    </div>
  );
}
