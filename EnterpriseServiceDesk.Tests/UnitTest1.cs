
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace EnterpriseServiceDesk.Tests;

public class UnitTest1
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UnitTest1(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRequests_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/api/requests");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CreateRequest_WithValidData_ReturnsCreated()
    {
        var request = new
        {
            title = "Laptop issue",
            description = "Laptop cannot connect to Wi-Fi."
        };

        var response = await _client.PostAsJsonAsync(
            "/api/requests", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var created = await response.Content
            .ReadFromJsonAsync<ServiceRequest>();

        Assert.NotNull(created);
        Assert.Equal("Laptop issue", created.Title);
        Assert.Equal("Medium", created.Priority);
        Assert.Equal("Open", created.Status);
    }

    [Fact]
    public async Task CreateRequest_WithMissingTitle_ReturnsBadRequest()
    {
        var request = new
        {
            title = "",
            description = "Laptop cannot connect to Wi-Fi."
        };

        var response = await _client.PostAsJsonAsync(
            "/api/requests", request);

        Assert.Equal(
            HttpStatusCode.BadRequest, response.StatusCode);
    }

    
    [Fact]
    public async Task GetRequestById_WhenNotFound_ReturnsNotFound()
    {
        var response = await _client.GetAsync("/api/requests/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateRequest_WhenNotFound_ReturnsNotFound()
    {
        var request = new
        {
            title = "Updated laptop issue",
            description = "Updated description",
            priority = "High",
            status = "In Progress"
        };

        var response = await _client.PutAsJsonAsync(
            "/api/requests/999999", request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteRequest_WhenNotFound_ReturnsNotFound()
    {
        var response = await _client.DeleteAsync("/api/requests/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateRequest_WithValidData_ReturnsOk()
    {
        var createRequest = new
        {
            title = "Laptop issue",
            description = "Cannot connect to Wi-Fi."
        };

        var createResponse = await _client.PostAsJsonAsync(
            "/api/requests", createRequest);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var created = await createResponse.Content
            .ReadFromJsonAsync<ServiceRequest>();

        Assert.NotNull(created);

        var updateRequest = new
        {
            title = "Laptop Wi-Fi issue",
            description = "Network adapter needs checking.",
            priority = "High",
            status = "In Progress"
        };

        var updateResponse = await _client.PutAsJsonAsync(
            $"/api/requests/{created.Id}", updateRequest);

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var updated = await updateResponse.Content
            .ReadFromJsonAsync<ServiceRequest>();

        Assert.NotNull(updated);
        Assert.Equal("Laptop Wi-Fi issue", updated.Title);
        Assert.Equal("High", updated.Priority);
        Assert.Equal("In Progress", updated.Status);
    }
    
}