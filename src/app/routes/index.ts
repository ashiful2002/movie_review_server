import { AuthRoutes } from "../modules/Auth/auth.route";
import { ReviewsRoutes } from "../modules/Review/review.route";
import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { WatchlistRoutes } from "../modules/Watchlist/watchlist.route";
import { PaymentsRoutes } from "../modules/Payments/payments.route";
import { MoviesRoutes } from "../modules/movie/movie.route";
import { GenreRoutes } from "../modules/Genre/genre.route";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.route";

const router = Router();

const routerManager = [
  { path: "/auth", route: AuthRoutes }, // auth routes tick mark
  { path: "/users", route: UserRoutes }, // user routes tick mark
  { path: "/movies", route: MoviesRoutes },
  { path: "/genres", route: GenreRoutes },
  { path: "/reviews", route: ReviewsRoutes }, // partially working, but huge work to done
  { path: "/watchlist", route: WatchlistRoutes }, // watchlist routes tick mark
  { path: "/payments", route: PaymentsRoutes },
  { path: "/subscription-plans", route: SubscriptionRoutes },
];

routerManager.forEach((r) => router.use(r.path, r.route));
export default router;
