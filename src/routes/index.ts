import { AuthRoutes } from "../modules/Auth/auth.route";
import { ReviewsRoutes } from "../modules/Review/review.route";
import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { WatchlistRoutes } from "../modules/Watchlist/watchlist.route";
import { PaymentsRoutes } from "../modules/Payments/payments.route";
import { MoviesRoutes } from "../modules/movie/movie.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { GenreRoutes } from "../modules/Genre/genre.route";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.route";

const router = Router();

const routerManager = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/movies", route: MoviesRoutes },
  { path: "/genres", route: GenreRoutes },
  { path: "/reviews", route: ReviewsRoutes },
  { path: "/watchlist", route: WatchlistRoutes },
  { path: "/payments", route: PaymentsRoutes },
  { path: "/admin", route: AdminRoutes },
  { path: "/subscription-plans", route: SubscriptionRoutes },
];

routerManager.forEach((r) => router.use(r.path, r.route));
export default router;
