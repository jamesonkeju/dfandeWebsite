using Xunit;

namespace DFANDE.WebApi.IntegrationTests;

/// <summary>
/// Every integration test class shares exactly one CustomWebApplicationFactory
/// instance via this collection. Without it, xUnit runs test classes in
/// parallel, each constructing its own factory against the same `dfande_test`
/// database — two factories seeding the same users concurrently causes a
/// duplicate-key race (confirmed: this is exactly what happened before this
/// fix). Collection membership also makes xUnit run these classes' tests
/// sequentially relative to each other, which the shared DB requires.
/// </summary>
[CollectionDefinition("Integration Tests")]
public class IntegrationTestCollection : ICollectionFixture<CustomWebApplicationFactory>;
