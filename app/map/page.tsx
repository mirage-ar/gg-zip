import MapboxMap from "@/components/map/MapboxMap";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <MapboxMap />
    </div>
  );
}
