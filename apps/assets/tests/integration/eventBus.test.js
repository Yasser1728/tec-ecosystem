/**
 * Integration Tests for Assets Domain Event Bus
 *
 * These tests verify the integration between Assets domain and other domains
 * through the Event Bus, ensuring events are properly published and consumed.
 *
 * @module apps/assets/tests/integration/eventBus.test
 */

const eventBus = require("../../../../lib/eventBus");
const integrationService = require("../../services/integrationService");
const AssetService = require("../../services/assetService");

// Constants for test timeouts
const EVENT_PROCESSING_TIMEOUT = 100;
const ASYNC_TIMEOUT = 500;

describe("Assets Domain Event Bus Integration", () => {
  let assetService;

  beforeAll(() => {
    // Initialize integration service
    integrationService.initialize();
    assetService = new AssetService();
  });

  afterAll(() => {
    // Cleanup subscriptions
    integrationService.cleanup();
    eventBus.clearHistory();
  });

  beforeEach(() => {
    // Clear event history before each test
    eventBus.clearHistory();
  });

  describe("FundX Investment Integration", () => {
    it("should create asset when fundx.investment.created event is published", async () => {
      // Mock asset creation
      const mockAsset = {
        id: "asset_fundx_123",
        name: "Growth Portfolio",
        portfolioId: "port_123",
        currentValue: 10000,
      };

      assetService.handleFundXInvestment = jest
        .fn()
        .mockResolvedValue(mockAsset);

      // Publish FundX investment event
      const eventData = {
        investmentId: "inv_123",
        portfolioId: "port_123",
        userId: "user_123",
        strategyName: "Growth Portfolio",
        amount: 10000,
        shares: 400,
        pricePerUnit: 25,
        date: new Date(),
        strategy: "GROWTH",
        riskLevel: "MEDIUM",
      };

      eventBus.publish("fundx.investment.created", eventData, {
        correlationId: "test_corr_123",
        userId: "user_123",
      });

      // Wait for event processing
      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT),
      );

      // Verify event was published
      const history = eventBus.getHistory({
        eventType: "fundx.investment.created",
      });
      expect(history.length).toBe(1);
      expect(history[0].eventData).toMatchObject(eventData);
    });

    it("should publish assets.asset.created event after processing FundX event", (done) => {
      const mockAsset = {
        id: "asset_123",
        name: "Test Investment",
        portfolioId: "port_123",
        currentValue: 5000,
      };

      assetService.handleFundXInvestment = jest
        .fn()
        .mockResolvedValue(mockAsset);

      // Subscribe to asset created event
      const unsubscribe = eventBus.subscribe(
        "assets.asset.created",
        (eventData) => {
          expect(eventData.assetId).toBe("asset_123");
          expect(eventData.sourceDomain).toBe("fundx");
          unsubscribe();
          done();
        },
      );

      // Publish FundX event
      eventBus.publish("fundx.investment.created", {
        investmentId: "inv_123",
        portfolioId: "port_123",
        userId: "user_123",
        strategyName: "Test Investment",
        amount: 5000,
        shares: 200,
        pricePerUnit: 25,
        date: new Date(),
        strategy: "BALANCED",
        riskLevel: "LOW",
      });
    });
  });

  describe("Estate Property Integration", () => {
    it("should create asset when estate.property.purchased event is published", async () => {
      const mockAsset = {
        id: "asset_estate_456",
        name: "Luxury Villa",
        portfolioId: "port_123",
        currentValue: 500000,
      };

      assetService.handleEstateProperty = jest
        .fn()
        .mockResolvedValue(mockAsset);

      // Publish Estate property event
      const eventData = {
        propertyId: "prop_123",
        portfolioId: "port_123",
        userId: "user_123",
        propertyName: "Luxury Villa",
        price: 500000,
        purchaseDate: new Date(),
        address: "123 Main Street",
        propertyType: "VILLA",
        sqm: 300,
        transactionId: "tx_123",
      };

      eventBus.publish("estate.property.purchased", eventData, {
        correlationId: "test_corr_456",
        userId: "user_123",
      });

      // Wait for event processing
      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT),
      );

      // Verify event was published
      const history = eventBus.getHistory({
        eventType: "estate.property.purchased",
      });
      expect(history.length).toBe(1);
      expect(history[0].eventData.propertyName).toBe("Luxury Villa");
    });

    it("should publish to analytics after creating real estate asset", (done) => {
      const mockAsset = {
        id: "asset_456",
        name: "Downtown Apartment",
        portfolioId: "port_123",
        currentValue: 250000,
      };

      assetService.handleEstateProperty = jest
        .fn()
        .mockResolvedValue(mockAsset);

      // Subscribe to analytics event
      const unsubscribe = eventBus.subscribe(
        "analytics.data.updated",
        (eventData) => {
          if (
            eventData.type === "asset_created" &&
            eventData.data.assetType === "REAL_ESTATE"
          ) {
            expect(eventData.domain).toBe("assets");
            expect(eventData.data.source).toBe("estate");
            unsubscribe();
            done();
          }
        },
      );

      // Publish Estate event
      eventBus.publish("estate.property.purchased", {
        propertyId: "prop_456",
        portfolioId: "port_123",
        userId: "user_123",
        propertyName: "Downtown Apartment",
        price: 250000,
        purchaseDate: new Date(),
        address: "456 Oak Avenue",
        propertyType: "APARTMENT",
        sqm: 150,
        transactionId: "tx_456",
      });
    });
  });

  describe("Commerce Product Integration", () => {
    it("should create asset for trackable products", async () => {
      const mockAsset = {
        id: "asset_commerce_789",
        name: "Luxury Watch",
        portfolioId: "port_123",
        currentValue: 50000,
      };

      assetService.handleCommerceProduct = jest
        .fn()
        .mockResolvedValue(mockAsset);

      // Publish Commerce event with trackAsAsset flag
      const eventData = {
        productId: "prod_123",
        portfolioId: "port_123",
        userId: "user_123",
        productName: "Luxury Watch",
        quantity: 1,
        unitPrice: 50000,
        purchaseDate: new Date(),
        trackAsAsset: true,
        assetType: "COLLECTIBLE",
        orderId: "order_123",
        category: "luxury",
      };

      eventBus.publish("commerce.product.purchased", eventData);

      // Wait for event processing
      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT),
      );

      const history = eventBus.getHistory({
        eventType: "commerce.product.purchased",
      });
      expect(history.length).toBe(1);
    });

    it("should not create asset for non-trackable products", async () => {
      const mockResult = {
        success: false,
        message: "Product not marked for asset tracking",
      };

      assetService.handleCommerceProduct = jest
        .fn()
        .mockResolvedValue(mockResult);

      // Publish Commerce event without trackAsAsset flag
      const eventData = {
        productId: "prod_456",
        portfolioId: "port_123",
        userId: "user_123",
        productName: "Regular Product",
        quantity: 1,
        unitPrice: 100,
        purchaseDate: new Date(),
        trackAsAsset: false,
        orderId: "order_456",
        category: "general",
      };

      eventBus.publish("commerce.product.purchased", eventData);

      // Wait for event processing
      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT),
      );

      // Event should be published but not create asset
      const history = eventBus.getHistory({
        eventType: "assets.asset.created",
      });
      const commerceAssets = history.filter(
        (e) => e.eventData.sourceDomain === "commerce",
      );
      expect(commerceAssets.length).toBe(0);
    });
  });

  describe("Insurance Policy Integration", () => {
    it("should link insurance to asset when policy is created", async () => {
      const mockResult = {
        success: true,
        asset: {
          id: "asset_123",
          metadata: {
            insurance: {
              policyId: "policy_123",
              provider: "TEC Insurance",
            },
          },
        },
      };

      assetService.linkToInsurance = jest.fn().mockResolvedValue(mockResult);

      // Publish insurance policy linked event
      const eventData = {
        policyId: "policy_123",
        assetId: "asset_123",
        userId: "user_123",
        provider: "TEC Insurance",
        policyType: "PROPERTY",
        coverage: 500000,
        premium: 5000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };

      eventBus.publish("insure.policy.asset.linked", eventData);

      // Wait for event processing
      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT),
      );

      const history = eventBus.getHistory({
        eventType: "insure.policy.asset.linked",
      });
      expect(history.length).toBe(1);
    });

    it("should publish asset updated event after insurance linking", (done) => {
      const mockResult = {
        success: true,
        asset: { id: "asset_123" },
      };

      assetService.linkToInsurance = jest.fn().mockResolvedValue(mockResult);

      // Subscribe to asset updated event
      const unsubscribe = eventBus.subscribe(
        "assets.asset.updated",
        (eventData) => {
          if (eventData.changes.insurance === "linked") {
            expect(eventData.assetId).toBe("asset_123");
            expect(eventData.policyId).toBe("policy_456");
            unsubscribe();
            done();
          }
        },
      );

      // Publish insurance event
      eventBus.publish("insure.policy.asset.linked", {
        policyId: "policy_456",
        assetId: "asset_123",
        userId: "user_123",
        provider: "Global Insurance",
        policyType: "COMPREHENSIVE",
        coverage: 1000000,
        premium: 10000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
    });
  });

  describe("Event History and Tracking", () => {
    it("should maintain event history", () => {
      // Publish multiple events
      eventBus.publish("test.event.1", { data: 1 });
      eventBus.publish("test.event.2", { data: 2 });
      eventBus.publish("test.event.3", { data: 3 });

      const history = eventBus.getHistory();
      expect(history.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter event history by type", () => {
      eventBus.publish("fundx.investment.created", { id: 1 });
      eventBus.publish("estate.property.purchased", { id: 2 });
      eventBus.publish("fundx.investment.created", { id: 3 });

      const fundxHistory = eventBus.getHistory({
        eventType: "fundx.investment.created",
      });
      expect(fundxHistory.length).toBe(2);
    });

    it("should include metadata in events", () => {
      const metadata = {
        correlationId: "corr_123",
        userId: "user_123",
      };

      eventBus.publish("test.event", { data: "test" }, metadata);

      const history = eventBus.getHistory({ eventType: "test.event" });
      expect(history[0].metadata.correlationId).toBe("corr_123");
      expect(history[0].metadata.userId).toBe("user_123");
    });
  });

  describe("Event Subscriber Management", () => {
    it("should track active subscribers", () => {
      const subscribers = eventBus.getSubscribers();

      // Should have subscribers from integration service
      expect(Object.keys(subscribers).length).toBeGreaterThan(0);
      expect(subscribers["fundx.investment.created"]).toBeDefined();
      expect(subscribers["estate.property.purchased"]).toBeDefined();
    });

    it("should allow unsubscribing from events", () => {
      let callCount = 0;

      const unsubscribe = eventBus.subscribe("test.unsubscribe", () => {
        callCount++;
      });

      eventBus.publish("test.unsubscribe", {});
      expect(callCount).toBe(1);

      unsubscribe();

      eventBus.publish("test.unsubscribe", {});
      expect(callCount).toBe(1); // Should not increase
    });
  });

  describe("Error Handling", () => {
    it("should handle errors in event handlers gracefully", (done) => {
      // Subscribe to error events
      const unsubscribe = eventBus.subscribe("error", (errorData) => {
        expect(errorData.error).toContain("Test error");
        unsubscribe();
        done();
      });

      // Subscribe with handler that throws error
      eventBus.subscribe("test.error.event", () => {
        throw new Error("Test error");
      });

      // Publish event that will cause error
      eventBus.publish("test.error.event", { data: "test" });
    });

    it("should continue processing other events after an error", async () => {
      let successCount = 0;

      // Handler that throws error
      eventBus.subscribe("test.mixed.events", () => {
        throw new Error("Handler error");
      });

      // Handler that succeeds
      eventBus.subscribe("test.mixed.events", () => {
        successCount++;
      });

      eventBus.publish("test.mixed.events", {});

      await new Promise((resolve) =>
        setTimeout(resolve, EVENT_PROCESSING_TIMEOUT / 2),
      );

      expect(successCount).toBe(1);
    });
  });
});
