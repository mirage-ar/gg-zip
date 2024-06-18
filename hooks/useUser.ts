import { useApplicationContext } from "@/state/ApplicationContext";
import { Player } from "@/types";

export default function useUser() {
  const { setGlobalUser } = useApplicationContext();

  const fetchUser = async (wallet: string): Promise<Player | null> => {
    const response = await fetch(`/api/user/${wallet}`);
    const result = await response.json();
    if (result.success) {
      const data = result.data;
      return {
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: wallet,
        points: data.points,
        boxes: data.boxes,
      };
    }
    return null;
  };

  const createUpdateUser = async (wallet: string, username: string, image: string, twitterId?: string) => {
    try {
      const response = await fetch(`/api/user/${wallet}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          image,
          twitterId,
        }),
      });

      const result = await response.json();
      const data = result.data;

      setGlobalUser({
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: wallet,
        points: data.points,
        boxes: data.boxes,
      });
    } catch (error) {
      console.error("createUpdateUser error:", error);
    }
  };

  return { fetchUser, createUpdateUser };
}
