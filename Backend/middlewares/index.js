import JWT from "jsonwebtoken";

const signTokenForConsumer = async (user) => {
  return JWT.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_KEY_CONSUMER,
    {
      expiresIn: "1d",
    }
  );
};

const signTokenForAdmin = async (user) => {
  return JWT.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_KEY_ADMIN,
    {
      expiresIn: "1d",
    }
  );
};

export { signTokenForConsumer, signTokenForAdmin };

