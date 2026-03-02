def test_create_customer(client):
    response = client.post(
        "/customers/",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "123456789",
            "company": "Test Co",
            "status": "lead",
            "notes": "Interested in our product"
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "john@example.com"
    assert data["id"] is not None


def test_create_customer_duplicate_email(client):
    customer_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
    }
    client.post("/customers/", json=customer_data)
    response = client.post("/customers/", json=customer_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_list_customers(client):
    client.post("/customers/", json={"first_name": "A", "last_name": "B", "email": "a@ex.com"})
    client.post("/customers/", json={"first_name": "C", "last_name": "D", "email": "c@ex.com"})
    
    response = client.get("/customers/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_customer(client):
    create_res = client.post("/customers/", json={"first_name": "John", "last_name": "Doe", "email": "john@ex.com"})
    customer_id = create_res.json()["id"]
    
    response = client.get(f"/customers/{customer_id}")
    assert response.status_code == 200
    assert response.json()["first_name"] == "John"


def test_update_customer(client):
    create_res = client.post("/customers/", json={"first_name": "John", "last_name": "Doe", "email": "john@ex.com"})
    customer_id = create_res.json()["id"]
    
    response = client.patch(f"/customers/{customer_id}", json={"first_name": "Johnny"})
    assert response.status_code == 200
    assert response.json()["first_name"] == "Johnny"


def test_delete_customer(client):
    create_res = client.post("/customers/", json={"first_name": "John", "last_name": "Doe", "email": "john@ex.com"})
    customer_id = create_res.json()["id"]
    
    response = client.delete(f"/customers/{customer_id}")
    assert response.status_code == 204
    
    get_res = client.get(f"/customers/{customer_id}")
    assert get_res.status_code == 404


def test_update_customer_duplicate_email(client):
    client.post("/customers/", json={"first_name": "A", "last_name": "B", "email": "a@ex.com"})
    create_res = client.post("/customers/", json={"first_name": "C", "last_name": "D", "email": "c@ex.com"})
    customer_id = create_res.json()["id"]
    
    # Try to update C's email to A's email
    response = client.patch(f"/customers/{customer_id}", json={"email": "a@ex.com"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_export_csv(client):
    client.post("/customers/", json={"first_name": "John", "last_name": "Doe", "email": "john@ex.com"})
    
    response = client.get("/customers/export/csv")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "id,first_name,last_name,email" in response.text
    assert "john@ex.com" in response.text
