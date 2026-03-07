import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";



actor {
  module Material {
    public type Material = {
      #naturalTeak;
      #matteWalnut;
      #charcoalAsh;
    };
  };
  public type Material = Material.Material;

  module Upholstery {
    public type Upholstery = {
      #performanceBoucle;
      #italianVelvet;
    };
  };
  public type Upholstery = Upholstery.Upholstery;

  module Room {
    public type Room = {
      #living;
      #dining;
      #bedroom;
    };
  };
  public type Room = Room.Room;

  module Category {
    public type Category = {
      #sofa;
      #diningTable;
      #bed;
      #mediaUnit;
    };
  };
  public type Category = Category.Category;

  public type Product = {
    id : Text;
    name : Text;
    category : Category;
    room : Room;
    availableMaterials : [Material];
    availableUpholstery : [Upholstery];
    priceInr : Nat;
    description : Text;
    isNewArrival : Bool;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  public type ShowroomLead = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    pincode : Text;
    message : Text;
    timestamp : Int;
  };

  module ShowroomLead {
    public func compare(l1 : ShowroomLead, l2 : ShowroomLead) : Order.Order {
      Int.compare(l2.timestamp, l1.timestamp);
    };
  };

  // In-memory storage
  var nextLeadId = 1;
  var leadMap = Map.empty<Text, ShowroomLead>();
  var viewCounts = Map.empty<Text, Nat>();

  // Seed data for product array
  let products : [Product] = [
    {
      id = "prod1";
      name = "Westminster Luxe Sofa";
      category = #sofa;
      room = #living;
      availableMaterials = [#naturalTeak, #matteWalnut];
      availableUpholstery = [#performanceBoucle];
      priceInr = 550_000;
      description = "Elegant 3-seater sofa with timeless design, premium teak frame, and plush boucle upholstery.";
      isNewArrival = true;
    },
    {
      id = "prod2";
      name = "Moderno Dining Table";
      category = #diningTable;
      room = #dining;
      availableMaterials = [#matteWalnut, #charcoalAsh];
      availableUpholstery = [];
      priceInr = 320_000;
      description = "Sleek walnut dining table with expandable surface, seats six comfortably.";
      isNewArrival = false;
    },
    {
      id = "prod3";
      name = "Carlton Leather Sofa";
      category = #sofa;
      room = #living;
      availableMaterials = [#naturalTeak];
      availableUpholstery = [#italianVelvet];
      priceInr = 475_000;
      description = "Classic Chesterfield style with deep button tufting and supple Italian velvet.";
      isNewArrival = false;
    },
    {
      id = "prod4";
      name = "Athena Bed Frame";
      category = #bed;
      room = #bedroom;
      availableMaterials = [#matteWalnut, #charcoalAsh];
      availableUpholstery = [];
      priceInr = 415_000;
      description = "Contemporary walnut bed frame with streamlined silhouette and high headboard.";
      isNewArrival = true;
    },
    {
      id = "prod5";
      name = "Skye Media Console";
      category = #mediaUnit;
      room = #living;
      availableMaterials = [#naturalTeak];
      availableUpholstery = [];
      priceInr = 250_000;
      description = "Spacious media unit with cable management and ample storage for entertainment devices.";
      isNewArrival = false;
    },
    {
      id = "prod6";
      name = "Verona Dining Set";
      category = #diningTable;
      room = #dining;
      availableMaterials = [#naturalTeak, #matteWalnut];
      availableUpholstery = [];
      priceInr = 430_000;
      description = "Complete teak dining set with matching chairs, perfect for family gatherings.";
      isNewArrival = true;
    },
    {
      id = "prod7";
      name = "Savoy King Bed";
      category = #bed;
      room = #bedroom;
      availableMaterials = [#matteWalnut, #charcoalAsh];
      availableUpholstery = [#performanceBoucle];
      priceInr = 600_000;
      description = "Luxurious king-sized bed featuring tufted headboard and solid walnut construction.";
      isNewArrival = false;
    },
    {
      id = "prod8";
      name = "Metropolitan Sectional Sofa";
      category = #sofa;
      room = #living;
      availableMaterials = [#matteWalnut];
      availableUpholstery = [#italianVelvet];
      priceInr = 720_000;
      description = "Spacious sectional sofa, modular design, suitable for large living spaces.";
      isNewArrival = true;
    },
    {
      id = "prod9";
      name = "Eclipse Media Cabinet";
      category = #mediaUnit;
      room = #living;
      availableMaterials = [#charcoalAsh, #naturalTeak];
      availableUpholstery = [];
      priceInr = 195_000;
      description = "Stylish media cabinet with hidden compartments and minimalist design.";
      isNewArrival = false;
    },
    {
      id = "prod10";
      name = "Siena Bedside Tables";
      category = #bed;
      room = #bedroom;
      availableMaterials = [#naturalTeak, #matteWalnut];
      availableUpholstery = [];
      priceInr = 130_000;
      description = "Pair of bedside tables featuring soft-close drawers and premium craftsmanship.";
      isNewArrival = false;
    },
  ];

  // Queries

  public query ({ caller }) func getProducts() : async [Product] {
    products;
  };

  public query ({ caller }) func getProductById(id : Text) : async ?Product {
    products.find(
      func(product) {
        product.id == id;
      }
    );
  };

  public query ({ caller }) func getProductsByRoom(room : Text) : async [Product] {
    let filtered = products.filter(
      func(product) {
        switch (product.room) {
          case (#living) { room == "living" };
          case (#dining) { room == "dining" };
          case (#bedroom) { room == "bedroom" };
        };
      }
    );
    filtered;
  };

  public query ({ caller }) func getProductsByMaterial(material : Text) : async [Product] {
    let filtered = products.filter(
      func(product) {
        product.availableMaterials.find(
          func(mat) {
            switch (mat, material) {
              case (#naturalTeak, "naturalTeak") { true };
              case (#matteWalnut, "matteWalnut") { true };
              case (#charcoalAsh, "charcoalAsh") { true };
              case (_, _) { false };
            };
          }
        ) != null;
      }
    );
    filtered;
  };

  public query ({ caller }) func getNewArrivals() : async [Product] {
    products.filter(
      func(product) {
        product.isNewArrival;
      }
    );
  };

  public query ({ caller }) func getShowroomLeads() : async [ShowroomLead] {
    leadMap.values().toArray().sort();
  };

  // Updates

  public shared ({ caller }) func submitShowroomLead(name : Text, email : Text, phone : Text, pincode : Text, message : Text) : async Text {
    let id = nextLeadId.toText();
    let newLead : ShowroomLead = {
      id;
      name;
      email;
      phone;
      pincode;
      message;
      timestamp = Time.now();
    };

    leadMap.add(id, newLead);
    nextLeadId += 1;
    id;
  };

  // Product View Tracking

  public shared ({ caller }) func recordView(productId : Text) : async () {
    let currentCount = switch (viewCounts.get(productId)) {
      case (null) { 0 };
      case (?count) { count };
    };
    viewCounts.add(productId, currentCount + 1);
  };

  // View count comparison type
  type ProductViewCount = {
    product : Product;
    count : Nat;
  };

  module ProductViewCount {
    public func compare(a : ProductViewCount, b : ProductViewCount) : Order.Order {
      Nat.compare(b.count, a.count);
    };
  };

  public query ({ caller }) func getMostLoved(limit : Nat) : async [Product] {
    // Convert products to array of ProductViewCount with view counts
    let productViews : [ProductViewCount] = products.map(
      func(prod) {
        let count = switch (viewCounts.get(prod.id)) {
          case (null) { 0 };
          case (?c) { c };
        };
        {
          product = prod;
          count;
        };
      }
    );

    // Sort by count descending using custom comparator
    let sorted = productViews.sort(
      func(a, b) { ProductViewCount.compare(a, b) }
    );

    let actualLimit = Nat.min(limit, sorted.size());
    let limitedProducts = Array.tabulate(actualLimit, func(i) { sorted[i].product });

    limitedProducts;
  };
};
