package ???;

public class UserObject {
    private String username;
    private int points;
    private int coins;

    UserObject(String username) {
        this.username = username;
        this.points = 0;
        this.coins = 0;
    }

    UserObject(String username, int points) {
        this.username = username;
        this.points = points;
        this.coins = 0;
    }

    UserObject(String username,int points, int coins) {
        this.username = username;
        this.points = points;
        this.coins = coins;
    }

    public int getPoints() {
        return points;
    }
    public int getCoins() {
        return coins;
    }
}
