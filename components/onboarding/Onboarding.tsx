import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { useApplicationContext } from "@/state/ApplicationContext";
import styles from "./Onboarding.module.css";

import { UPLOAD_API } from "@/utils/constants";
import { resizeImage } from "@/utils";
import { useUser } from "@/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

const Onboarding: React.FC = () => {
  const [username, setUsername] = useState(`#${new Date().getTime().toString().substring(8)}`); // default username
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { publicKey } = useWallet();

  const { createUpdateUser } = useUser();
  const { showOnboarding, setShowOnboarding } = useApplicationContext();

  useEffect(() => {
    const fetchUserData = async () => {
      if (publicKey) {
        const response = await fetch(`/api/user/${publicKey.toBase58()}`);
        const result = await response.json();
        if (result.success) {
          setUsername(result.data.username);
          setPreview(result.data.image);
        } else {
          setUsername(`#${new Date().getTime().toString().substring(8)}`);
          setPreview(null);
        }
      }
    };

    fetchUserData();
  }, [publicKey]);

  // Function to stop event propagation
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // This stops the click from propagating to the parent
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const resizedImage = await resizeImage(file);
      setImage(file);
      setPreview(resizedImage);
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const isValid = /^[a-zA-Z0-9]*$/.test(newValue);

    if (isValid) {
      setUsername(newValue);
      setError(null);
    } else {
      setError("Username can only contain letters and numbers.");
    }
  };

  const handleSave = async () => {
    if (!publicKey) {
      setError("Public key is missing.");
      return;
    }

    if (preview && !image) {
      createUpdateUser(publicKey.toBase58(), username, preview);
      setShowOnboarding(false);
      return;
    }

    if (image) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const resizedImage = await resizeImage(image);

        const base64Image = resizedImage.split(",")[1];
        const response = await fetch(`${UPLOAD_API}/upload`, {
          method: "POST",
          body: JSON.stringify({ image: base64Image }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Image uploaded:", data.url);

        await createUpdateUser(publicKey.toBase58(), username, data.url);

        setLoading(false);
        setShowOnboarding(false);
      };
    }
  };

  return (
    showOnboarding && (
      <div className={styles.main} onClick={() => setShowOnboarding(false)}>
        <div className={styles.container} onClick={handleContainerClick}>
          <h4>EDIT PROFILE</h4>
          <div className={styles.profilePhotoContainer}>
            {preview ? (
              <label htmlFor="upload-input" style={{ cursor: "pointer" }}>
                <Image src={preview} alt="Profile Photo" width={64} height={64} className={styles.profilePhoto} />
              </label>
            ) : (
              <label htmlFor="upload-input" style={{ cursor: "pointer" }}>
                <Image
                  src="/assets/graphics/koji.png"
                  alt="Profile Photo"
                  width={64}
                  height={64}
                  className={styles.profilePhoto}
                />
              </label>
            )}
            <div className={styles.editProfilePhotoText}>
              <label htmlFor="upload-input" style={{ cursor: "pointer" }} className={styles.uploadImageLabel}>
                Edit profile photo
                <Image src="/assets/icons/icons-24/upload.svg" alt="Edit Icon" width={24} height={24} />
              </label>
              <input
                type="file"
                id="upload-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className={styles.input}
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>
          <div className={styles.saveContainer}>
            <button disabled={loading || !!error || !preview} className={styles.saveButton} onClick={handleSave}>
              {loading ? "..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Onboarding;
