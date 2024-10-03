import { Express } from "express";

const routesRegistry = (app: Express) => {
  app.use("/auth", require("../api/auth/authRoutes").default);
  app.use("/log", require("../api/log/logRoutes").default);
  app.use("/questionCategory", require("../api/questionCategory/questionCategoryRoutes").default);
  app.use("/role", require("../api/role/roleRoutes").default);
  app.use("/question", require("../api/questions/questionRoutes").default);
  app.use("/questionMapping", require("../api/userQuestionMapping/userQuestionMappingRoutes").default);
  app.use("/setting", require("../api/setting/settingRoutes").default);
  app.use("/upload", require("../api/imageUpload/imageUploadRoutes").default);
  app.use("/session", require("../api/session/sessionRoutes").default);
  app.use("/admin", require("../api/adminPanel/adminPanelRoutes").default);
  app.use("/superQuestionCategory", require("../api/superQuestionCategory/superQuestionCategoryRoutes").default);
  app.use("/quizCompetition", require("../api/quizCompetition/quiz/quizRoutes").default);
  app.use("/quiz", require("../api/quizCompetition/questions/questionRoutes").default);
  app.use("/userQuiz", require("../api/quizCompetition/userQuizCompetitionQuestion/userQuizCompetitionQuestionRoutes").default);
  app.use("/userQuizSession", require("../api/quizCompetition/session/sessionRoutes").default);
  app.use("/userQuizQuestions", require("../api/quizCompetition/userQuizCompetitionQuestion/userQuizCompetitionQuestionRoutes").default);
  app.use("/subscriptionType", require("../api/subscriptions/subscriptionType/subscriptionTypeRoutes").default);
  app.use("/subscriptionPlan", require("../api/subscriptions/subscriptionPlans/subscriptionPlanRoutes").default);
  app.use("/minorCategory", require("../api/minorCategory/minorCategoryRoutes").default);
  app.use("/order", require("../api/orders/ordersRoutes").default);
  app.use("/userSubscriptions", require("../api/subscriptions/userSubscriptions/userSubscriptionsRoutes").default);
  app.use("/tags", require("../api/tag/tagRoutes").default);
};

export default routesRegistry;
