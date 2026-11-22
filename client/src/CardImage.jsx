const pad2 = (n) => String(n).padStart(2, '0');

/** Photo in the soft frame, or a numbered pastel tile (as in the designs) when there's no photo. */
export default function CardImage({ image, index, alt = '', className = '' }) {
  return (
    <div className={`photo-frame ${className}`}>
      {image ? (
        <img src={image.src} width={image.width} height={image.height} alt={alt} loading="lazy" />
      ) : (
        <div className="tile" style={{ background: `var(--tile-${(index % 6) + 1})` }}>
          <span className="tile-number">{pad2(index + 1)}</span>
        </div>
      )}
    </div>
  );
}
