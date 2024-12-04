export class CustomOverlay extends google.maps.OverlayView {
  private div: HTMLDivElement | null = null;
  private location: google.maps.LatLngLiteral;

  constructor(location: google.maps.LatLngLiteral) {
    super();
    this.location = location;
  }

  onAdd() {
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.backgroundColor = "black";
    this.div.style.color = "white";
    this.div.style.padding = "5px 10px";
    this.div.style.borderRadius = "5px";
    this.div.style.fontSize = "14px";
    this.div.style.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.3)";
    this.div.innerText = `${this.location.lat}, ${this.location.lng}`;

    const panes = this.getPanes();
    panes?.overlayMouseTarget.appendChild(this.div);
  }

  draw() {
    if (!this.div) return;

    const projection = this.getProjection();
    const position = projection?.fromLatLngToDivPixel(new google.maps.LatLng(this.location));

    if (position) {
      this.div.style.left = `${position.x - this.div.offsetWidth / 2}px`;
      this.div.style.top = `${position.y - this.div.offsetHeight}px`;
    }
  }

  onRemove() {
    if (this.div) {
      this.div.parentNode?.removeChild(this.div);
      this.div = null;
    }
  }
}